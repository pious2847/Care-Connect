const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const PasswordReset = require("../models/utils_models/PasswordReset");
// const Users = require("../models/models.user");
// const axios = require("axios");




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.AUTH_EMAIL, pass: process.env.AUTH_PASS },
});


/**
 * Sends a password reset email with a verification code.
 * @param {string} email - The email address of the user.
 * @param {Object} user - The user object.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with status and message.
 */
const sendResetEmail = async (email, user, res) => {
  if (!user) {
    return res.status(400).json({ message: "Account not found" });
  }

  const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Password Verification Code",
    html: `
      <div style="background-color: #f0f0f0; padding: 20px;">
        <h2 style="color: #333; font-size: 24px;">Password Verification Code</h2>
        <p style="color: #555; font-size: 16px;">Enter the verification code below to verify your email and initiate a password reset.</p>
        <p style="color: #555; font-size: 16px;"><b>Verification Code:</b> <span style="background-color: #e0e0e0; padding: 5px 10px; border-radius: 5px;">${verificationCode}</span></p>
        <p style="color: #555; font-size: 16px;">This code expires in 1 hour.</p>
      </div>
    `,
  };

  try {
    await PasswordReset.deleteMany({ userId: user._id });
    const salt = 10;
    const hashedVerificationCode = await bcrypt.hash(verificationCode, salt);

    const newPasswordReset = new PasswordReset({
      userId: user._id,
      verificationCode: hashedVerificationCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour in milliseconds
    });

    await newPasswordReset.save();
    await transporter.sendMail(mailOptions);
    return { message: "Verification code sent successfully" };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending verification code" });
  }
};

/**
 * Verifies the password reset code and prepares for password update.
 * @param {string} verificationCode - The verification code entered by the user.
 * @param {string} userId - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with status and message.
 */
const resetPassword = async (verificationCode, userId, res) => {
  try {
    const passwordReset = await PasswordReset.findOne({ userId: userId });

    if (!passwordReset) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const validPassword = await bcrypt.compare(
      verificationCode,
      passwordReset.verificationCode
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await PasswordReset.deleteOne({ _id: passwordReset._id });

    return { message: "Email verification complete" };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

// /**
//  * Updates the user's password.
//  * @param {string} userId - The ID of the user.
//  * @param {string} newPassword - The new password.
//  * @param {Object} res - The response object.
//  * @returns {Object} JSON response with status and message.
//  */
// const updateUserPassword = async (userId, newPassword, res) => {
//   try {
//     const user = await Users.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     user.password = await bcrypt.hash(newPassword, salt);

//     await user.save();

//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error updating password" });
//   }
// };

/**
 * Sends an email to a specified recipient .
 * @param {string} recipient - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The HTML content of the email.
 * @returns {Object} JSON response with status and message.
 */
const sendEmail = async (recipient, subject, message,) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: recipient,
    subject: subject,
    html: `
    ${message}
    `,
  };

  try {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    
    await transporter.sendMail(mailOptions);
    return {success: true, message: "Email has been sent successfully"};
  } catch (error) {
    console.error(error);
    return {success: false, message: "Error sending email" };
  }
};

/**
 * Sends a course approval email to instructor .
 * @param {string} recipient - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The HTML content of the email.
 * @returns {Object} JSON response with status and message.
 */
const sendApprovalEmail = async ( recipient, subject, message,) => {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: recipient,
    subject: subject,
    html: `
    ${message}
    `,
  };

  try {
   const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    console.error("Error sending approval email:", error);
    throw error;
  }
};
// /**
//  * Sends an sms Mesage to user .
//  * @param {string} sender - The name of the organization sending.
//  * @param {string} message - The HTML content of the email.
//  * @param {string} recipientsPhone - The response object.
//  */

// const sendSMS = async (sender, message, recipientsPhone) => {
//   try {
//     // SEND SMS
//     const data = {
//       sender,
//       message,
//       recipients : [recipientsPhone],
//     };

//     const config = {
//       method: "post",
//       url: "https://sms.arkesel.com/api/v2/sms/send",
//       headers: {
//         "api-key": process.env.ARKESEL_API,
//       },
//       data,
//     };

//     const response = await axios(config);
//     console.log(response.data);
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error("SMS API Error:", error.response.data);
//       console.error("SMS API Status:", error.response.status);
//     } else if (error.request) {
//       // The request was made, but no response was received
//       console.error("SMS API Error:", error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("SMS API Error:", error.message);
//     }
//   }
// };

module.exports = {
  sendResetEmail,
  resetPassword,
  // updateUserPassword,
  sendEmail,
  sendApprovalEmail,
  // sendSMS
};