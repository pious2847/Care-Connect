const generateApprovalMessage = (instructor, course) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
    <header style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Course Approved!</h1>
    </header>
    
    <main style="padding: 20px;">
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Dear ${instructor.fullName},
      </p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        We are pleased to inform you that your course, <strong>"${course.title
    }"</strong>, has been approved and is now live on our platform.
      </p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        This is an exciting milestone, and we commend you for your hard work in creating valuable content for our learners.
      </p>
      
      <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; margin: 20px 0; padding: 15px;">
        <p style="font-size: 16px; line-height: 1.5; color: #333; margin: 0;">
          <strong>Course Details:</strong><br>
          Title: ${course.title}<br>
          ID: ${course._id}<br>
          Approval Date: ${new Date().toDateString()}
        </p>
      </div>
    
    </main>
    
    <footer style="background-color: #f1f1f1; color: #666; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 5px 5px;">
      <p style="margin: 0;">
        Thank you for being a valued instructor on our platform.<br>
        If you have any questions, please don't hesitate to contact our support team.
      </p>
    </footer>
  </div>
    `;
};

const generateWelcomeMessage = (user) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Care Connect</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #4a5568;">Welcome to Digital Madrasah - Your Journey in Islamic Learning Begins!</h1>
    
    <p>Dear ${user.fullName},</p>
    
    <p>Assalamu Alaikum (Peace be upon you),</p>
    
    <p>We are thrilled to welcome you to Digital Madrasah, your new home for enriching Islamic education. Thank you for taking the first step on this blessed journey of knowledge and spiritual growth.</p>
    
    <h2 style="color: #2d3748;">Registration Confirmation</h2>
    <p>Your account has been successfully created with the email address: ${user.email}</p>
    
    <h2 style="color: #2d3748;">Next Steps</h2>
    <ol>
        <li><strong>Complete Your Profile</strong>: Enhance your learning experience by updating your profile. This helps us tailor our recommendations to your interests and goals.</li>
        <li><strong>Explore Our Courses</strong>: Browse through our diverse catalog of Islamic courses. From Quranic studies to Islamic history, we offer a wide range of topics to cater to all levels of learners.</li>
        <li><strong>Stay Tuned</strong>: We're currently in our pre-launch phase. Keep an eye on your inbox for our official launch announcement, where we'll unveil our full suite of features and courses.</li>
    </ol>
    
    <h2 style="color: #2d3748;">What You Can Expect From Us</h2>
    <ul>
        <li>High-quality, authentic Islamic courses</li>
        <li>Expert instructors and scholars</li>
        <li>A supportive learning community</li>
        <li>Regular updates on new courses and features</li>
    </ul>
    
    <h2 style="color: #2d3748;">Need Help?</h2>
    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team at support@digitalmadrasah.com.</p>
    
    <p>May Allah (SWT) bless your journey in seeking knowledge.</p>
    
    <div style="font-style: italic; border-left: 3px solid #4a5568; padding-left: 10px; margin: 20px 0;">
        Remember, the Prophet Muhammad (peace be upon him) said: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise." (Sahih Muslim)
    </div>
    
    <p>We look forward to being a part of your Islamic learning journey.</p>
    
    <p>Jazak Allah Khair (May Allah reward you with goodness),</p>
    
    <p>The Digital Madrasah Team</p>
    
    <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 0.9em; color: #718096;">
        <p>Digital Madrasah<br>
        https://digitalmadrasah.vercel.app<br>
        [Social Media Links]</p>
        
        <p>If you didn't create an account on our platform, please ignore this email or contact us immediately.</p>
    </div>
</body>
</html>
  `;
};

const generatStaffeWelcomeMessage = (organization, user, password) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${organization.name} - Care Connect</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="${organization.logo.picture}" alt="${organization.username} Logo" style="max-width: 200px; height: auto;">
    </div>

    <h1 style="color: #2563eb; text-align: center;">Welcome to ${organization.name}</h1>
    
    <p>Dear ${user.title} ${user.firstname} ${user.lastname},</p>
    
    <p>Welcome to ${organization.name}! Your staff account has been successfully created in our system. Below are your account credentials to access the staff portal:</p>
    
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Your Account Details</h2>
        <p><strong>Staff ID:</strong> ${user.staffId}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p style="color: #dc2626; font-size: 0.9em;">Please change your password upon your first login for security purposes.</p>
    </div>

    <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Getting Started</h2>
        <ol style="padding-left: 20px;">
            <li><strong>Access the Portal:</strong> Visit <a href="https://care-connect-l1ha.onrender.com/login" style="color: #2563eb;">https://care-connect-l1ha.onrender.com/login</a></li>
            <li><strong>First Login:</strong> Use your email and temporary password provided above</li>
            <li><strong>Update Password:</strong> Change your password to something secure and memorable</li>
            <li><strong>Complete Profile:</strong> Update your profile information and add any required fields</li>
        </ol>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Important Information</h2>
        <ul style="padding-left: 20px;">
            <li>Position: ${user.position}</li>
            <li>Department: ${user.position}</li>
        </ul>
    </div>

    <p>If you experience any difficulties accessing your account or have questions, please contact our IT support team:</p>
    <p style="margin-left: 20px;">
        Email: fatawmumuni28@gmail.com<br>
        Phone: +233 24 274 3903
    </p>

    <p>We're excited to have you join our team and look forward to your contributions to ${user.organization}.</p>
    
    <p>Best regards,<br>
    Human Resources Department<br>
    ${organization.name}</p>
    
    <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px;">
        <table style="width: 100%;">
            <tr>
                <td style="text-align: center;">
                    <p style="color: #6b7280; font-size: 0.8em; margin: 0;">Powered by</p>
                    <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect" style="max-width: 120px; height: auto;">
                    <p style="color: #6b7280; font-size: 0.8em;">
                        Care Connect - Empowering Healthcare Organizations<br>
                        <a href="https://care-connect-l1ha.onrender.com/login" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
        <p>This email contains confidential information. If you received this in error, please notify us immediately.</p>
    </div>
</body>
</html>
  `;
};


const generateFacilityWelcomeMessage = (organization, paymentDetails) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Care Connect - ${organization.name}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
    </div>

    <h1 style="color: #2563eb; text-align: center;">Welcome to Care Connect!</h1>
    
    <p>Dear ${organization.name},</p>
    
    <p>Thank you for registering with Care Connect! Your healthcare facility account has been successfully created. Below are your account details and payment information:</p>
    
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Facility Details</h2>
        <p><strong>Facility Name:</strong> ${organization.name}</p>
        <p><strong>Email:</strong> ${organization.email}</p>
        <p><strong>Username:</strong> ${organization.username}</p>
        <p><strong>Contact:</strong> ${organization.contact}</p>
        <p><strong>Address:</strong> ${organization.address}</p>
        <p><strong>Ambulance Contact:</strong> ${organization.ambulancecontact}</p>
    </div>

    <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Payment Information</h2>
        <p><strong>Payment ID:</strong> ${paymentDetails.payment_id}</p>
        <p><strong>Complete Payment:</strong> <a href="${paymentDetails.authorization_url}" style="color: #2563eb;">Click here to complete your payment</a></p>
        <p style="color: #dc2626; font-size: 0.9em;">Please complete your payment to activate your subscription.</p>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Wallet Information</h2>
        <p><strong>Wallet Name:</strong> ${organization.wallet.name}</p>
        <p><strong>Wallet Number:</strong> ${organization.wallet.number}</p>
    </div>

    <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Getting Started</h2>
        <ol style="padding-left: 20px;">
            <li><strong>Complete Payment:</strong> Use the payment link above to activate your subscription</li>
            <li><strong>Access Dashboard:</strong> Visit <a href="https://care-connect-l1ha.onrender.com/login" style="color: #2563eb;">https://care-connect-l1ha.onrender.com/login</a></li>
            <li><strong>Update Profile:</strong> Complete your facility profile with any additional information</li>
            <li><strong>Explore Features:</strong> Familiarize yourself with our healthcare management tools</li>
        </ol>
    </div>

    <p>If you need any assistance or have questions, our support team is here to help:</p>
    <p style="margin-left: 20px;">
        Email: fatawmumuni28@gmail.com<br>
        Phone: +233 24 274 3903
    </p>

    <p>We're excited to have ${organization.name} join the Care Connect network!</p>
    
    <p>Best regards,<br>
    The Care Connect Team</p>
    
    <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px;">
        <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 0.8em; margin: 0;">Powered by</p>
            <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect" style="max-width: 120px; height: auto;">
            <p style="color: #6b7280; font-size: 0.8em;">
                Care Connect - Empowering Healthcare Organizations<br>
                <a href="https://care-connect-l1ha.onrender.com/login" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
            </p>
        </div>
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
        <p>This email contains confidential information. If you received this in error, please notify us immediately.</p>
    </div>
</body>
</html>
  `;
};

const generateAppointmentEmail = (appointment, facility) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation - Care Connect</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
    </div>

    <h1 style="color: #2563eb; text-align: center;">Appointment Confirmation</h1>
    
    <p>Dear ${appointment.name},</p>
    
    <p>Thank you for booking an appointment with us. We're looking forward to seeing you on ${appointment.date} at ${appointment.time}.</p>
    
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Your Appointment Details</h2>
        <p><strong>Appointment Date:</strong> ${appointment.date}</p>
        <p><strong>Appointment Time:</strong> ${appointment.time}</p>
        <p><strong>Provider:</strong> ${appointment.name}</p>
        <p><strong>Reason for Visit:</strong> ${appointment.message} </p>
        <p><strong>Meeting Room:</strong> https://care-connect-l1ha.onrender.com/room/${appointment._id} </p>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Important Information</h2>
        <ul style="padding-left: 20px;">
            <li>Please arrive 15 minutes early to complete any necessary paperwork.</li>
            <li>If you need to cancel or reschedule, please call us at ${facility.contact} or email ${facility.email}.</li>
            <li>Bring your insurance card and a valid photo ID to your appointment.</li>
        </ul>
    </div>

    <p>We look forward to providing you with excellent care. If you have any questions, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>
    ${facility.name} Team</p>
    
    <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px;">
        <table style="width: 100%;">
            <tr>
                <td style="text-align: center;">
                    <p style="color: #6b7280; font-size: 0.8em; margin: 0;">Powered by</p>
                    <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect" style="max-width: 120px; height: auto;">
                    <p style="color: #6b7280; font-size: 0.8em;">
                        Care Connect - Empowering Healthcare Organizations<br>
                        <a href="https://care-connect-l1ha.onrender.com/login" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
        <p>This email contains confidential information. If you received this in error, please notify us immediately.</p>
    </div>
</body>
</html>`
}

const generateFacilityAppointmentEmail = (appointment, facility) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Notification - Care Connect</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
    </div>

    <h1 style="color: #2563eb; text-align: center;">New Appointment Notification</h1>
    
    <p>Dear ${facility.name} Team,</p>
    
    <p>We would like to inform you of a new appointment that has been booked with your facility.</p>
    
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Appointment Details</h2>
        <p><strong>Patient Name:</strong> ${appointment.name}</p>
        <p><strong>Appointment Date:</strong> ${appointment.date}</p>
        <p><strong>Appointment Time:</strong> ${appointment.time}</p>
        <p><strong>Reason for Visit:</strong> ${appointment.message}</p>
        <p><strong>Meeting Room:</strong> <a href="https://care-connect-l1ha.onrender.com/room/${appointment._id}">Join Meeting</a></p>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #1e40af; margin-top: 0;">Patient Contact Information</h2>
        <p><strong>Email:</strong> ${appointment.email}</p>
        <p><strong>Phone:</strong> ${appointment.phone}</p>
    </div>

    <p>Please ensure you have this appointment scheduled and make any necessary preparations. If you have any questions or need to reschedule, please contact the patient directly or reach out to our team.</p>
    
    <p>Best regards,<br>
    Care Connect Team</p>
    
    <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px;">
        <table style="width: 100%;">
            <tr>
                <td style="text-align: center;">
                    <p style="color: #6b7280; font-size: 0.8em; margin: 0;">Powered by</p>
                    <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect" style="max-width: 120px; height: auto;">
                    <p style="color: #6b7280; font-size: 0.8em;">
                        Care Connect - Empowering Healthcare Organizations<br>
                        <a href="https://care-connect-l1ha.onrender.com/login" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
        <p>This email contains confidential information. If you received this in error, please notify us immediately.</p>
    </div>
</body>
</html>
`;
};
module.exports = { generateApprovalMessage, generateWelcomeMessage, generatStaffeWelcomeMessage, generateFacilityWelcomeMessage, generateAppointmentEmail, generateFacilityAppointmentEmail };
