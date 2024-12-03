const socket = io();
let videoGrid; // Declare outside to ensure global scope
const localVideo = document.createElement("video");
localVideo.muted = true; // Mute local video to avoid feedback

// WebRTC configuration with STUN servers
const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

let localStream;
const peers = {};
let localPeerId;
let isAudioEnabled = true;
let isVideoEnabled = true;
let isScreenSharing = false;

// Ensure DOM is loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  videoGrid = document.getElementById("video-grid");
  if (!videoGrid) {
    console.error("Video grid element not found. Check your HTML.");
    return;
  }
  setupMediaStream();
});

// Initialize media stream
async function setupMediaStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: true,
    });

    localVideo.srcObject = localStream;
    localVideo.setAttribute("data-peer-id", "local");
    localVideo.muted = true;
    addVideoStream(localVideo, localStream);

    localPeerId = generateUserId();
    socket.emit("join-room", ROOM_ID, localPeerId);

    socket.on("user-connected", (userId) => {
      console.log("New user connected:", userId);
      connectToNewUser(userId, localStream);

      updateParticipantCount();
    });

    socket.on("user-signal", async ({ userId, signal }) => {
      await handleUserSignal(userId, signal);
    });

    socket.on("user-disconnected", (userId) => {
      removeUserVideo(userId);
    });
  } catch (error) {
    console.error("Error accessing media devices:", error);
    alert(
      "Unable to access camera or microphone. Please check your permissions."
    );
  }
}

// Connect to a new user
function connectToNewUser(userId, stream) {
  if (peers[userId]) {
    console.log("Peer connection already exists for:", userId);
    return;
  }

  const peer = new RTCPeerConnection(configuration);
  peers[userId] = peer;

  stream.getTracks().forEach((track) => {
    peer.addTrack(track, stream);
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("signal", {
        userId: userId,
        signal: { type: "ice-candidate", candidate: event.candidate },
      });
    }
  };

  peer.ontrack = (event) => {
    const video = document.createElement("video");
    video.setAttribute("data-peer-id", userId);
    addVideoStream(video, event.streams[0]);
  };

  peer
    .createOffer()
    .then((offer) => peer.setLocalDescription(offer))
    .then(() => {
      socket.emit("signal", {
        userId: userId,
        signal: { type: "offer", sdp: peer.localDescription },
      });
    })
    .catch((error) => console.error("Offer creation error:", error));
}

// Handle incoming signals
async function handleUserSignal(userId, signal) {
  let peer = peers[userId];
  if (!peer) {
    peer = new RTCPeerConnection(configuration);
    peers[userId] = peer;

    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          userId: userId,
          signal: { type: "ice-candidate", candidate: event.candidate },
        });
      }
    };

    peer.ontrack = (event) => {
      const video = document.createElement("video");
      video.setAttribute("data-peer-id", userId);
      addVideoStream(video, event.streams[0]);
    };
  }

  switch (signal.type) {
    case "offer":
      await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("signal", {
        userId: userId,
        signal: { type: "answer", sdp: answer },
      });
      break;
    case "answer":
      if (peer.signalingState === "have-local-offer") {
        await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      }
      break;
    case "ice-candidate":
      if (signal.candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
      break;
  }
}

// Add a video stream to the grid
function addVideoStream(video, stream) {
  if (!videoGrid || !stream) {
    console.error("Video grid or stream is missing");
    return;
  }
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play().catch((error) => console.error("Error playing video:", error));
  });
  video.setAttribute("autoplay", true);
  video.setAttribute("playsinline", true);
  videoGrid.appendChild(video);
  updateParticipantCount();
}

// Remove a user's video
function removeUserVideo(userId) {
  const videoToRemove = document.querySelector(`[data-peer-id="${userId}"]`);
  if (videoToRemove) {
    videoGrid.removeChild(videoToRemove);
    delete peers[userId];
    updateParticipantCount();
  }
}

// Utility functions
function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;
  localStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = isAudioEnabled));
  updateButtons();
}

function toggleVideo() {
  isVideoEnabled = !isVideoEnabled;
  localStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = isVideoEnabled));
  updateButtons();
}

function toggleScreenShare() {
  if (!isScreenSharing) {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((screenStream) => {
        const screenTrack = screenStream.getVideoTracks()[0];
        replaceTrack(screenTrack);
        screenTrack.onended = () => toggleScreenShare(); // Stop sharing when track ends
        isScreenSharing = true;
        updateButtons();
      });
  } else {
    const videoTrack = localStream.getVideoTracks()[0];
    replaceTrack(videoTrack);
    isScreenSharing = false;
    updateButtons();
  }
}

function replaceTrack(newTrack) {
  Object.values(peers).forEach((peer) => {
    const sender = peer
      .getSenders()
      .find((s) => s.track.kind === newTrack.kind);
    if (sender) sender.replaceTrack(newTrack);
  });
}

function leaveMeeting() {
  Object.values(peers).forEach((peer) => peer.close());
  socket.emit("leave-room", ROOM_ID);
  window.location.href = "/";
}

function generateUserId() {
  return Math.random().toString(36).substring(2, 15);
}
function updateParticipantCount() {
  const count = Object.keys(peers).length + 1; // Include local participant
  const participantElement = document.getElementById("participantCount");
  if (participantElement) {
    participantElement.innerText = `${count} Participants`;
  }
}

function updateButtons() {
  document
    .getElementById("audioBtn")
    .classList.toggle("btn-danger", !isAudioEnabled);
  document
    .getElementById("videoBtn")
    .classList.toggle("btn-danger", !isVideoEnabled);
  document
    .getElementById("screenBtn")
    .classList.toggle("btn-danger", isScreenSharing);
}
