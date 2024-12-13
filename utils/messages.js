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
        <p><strong>Payment ID:</strong> ${paymentDetails.reference}</p>
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

const generatePatientPaymentApprovedMessage = (patient, billing, facility) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Care Connect</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
      </div>
  
      <h1 style="color: #2563eb; text-align: center;">Payment Confirmation</h1>
      
      <p>Dear ${patient.firstName} ${patient.lastName},</p>
      
      <p>We are pleased to confirm that your medical bill has been successfully paid.</p>
      
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Payment Details</h2>
          <p><strong>Patient Name:</strong> ${patient.firstName} ${patient.lastName}</p>
          <p><strong>Invoice Number:</strong> INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
          <p><strong>Facility:</strong> ${facility.name}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Amount Due:</strong> $${billing.totalAmount.toFixed(2)}</p>
      </div>

      <p>Your medical bill has been fully settled. Please keep this confirmation for your records.</p>
  
      <p>If you have any questions about this payment or need further assistance, please contact our support:</p>
      <p style="margin-left: 20px;">
          Email: billing@careconnect.com<br>
          Phone: +233 24 274 3903
      </p>
  
      <p>Thank you for choosing Care Connect for your healthcare needs.</p>
      
      <p>Best regards,<br>
      Billing Department<br>
      Care Connect</p>
      
      <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 0.8em;">
              Care Connect - Empowering Healthcare Organizations<br>
              <a href="https://care-connect-l1ha.onrender.com" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
          </p>
      </div>
  
      <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
          <p>This payment confirmation is confidential and intended solely for the named recipient.</p>
      </div>
  </body>
  </html>
    `;
};

const generatePatientPaymentMessage = (patient, billing, authorization_url) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Details - Care Connect</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
      </div>
  
      <h1 style="color: #2563eb; text-align: center;">Payment Details</h1>
      
      <p>Dear ${patient.firstName} ${patient.lastName},</p>
      
      <p>We hope this message finds you well. Below are the details for your recent medical service billing.</p>
      
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Billing Information</h2>
          <p><strong>Patient Name:</strong> ${patient.firstName} ${patient.lastName}</p>
          <p><strong>Invoice Number:</strong> INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</p>
          <p><strong>Service Date:</strong> ${new Date()}</p>
          <p><strong>Total Amount Due:</strong> $${billing.totalAmount.toFixed(2)}</p>
      </div>
  x
      <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Payment Options</h2>
          <p>To complete your payment, please click the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
              <a href="${authorization_url}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Pay Now
              </a>
          </div>
          <p style="color: #dc2626; font-size: 0.9em;">
              <strong>Note:</strong> This payment link will expire in 24 hours. Please complete your payment before the expiration.
          </p>
      </div>
  
  
      <p>If you have any questions about this bill or need assistance, please contact our billing support:</p>
      <p style="margin-left: 20px;">
          Email: billing@careconnect.com<br>
          Phone: +233 24 274 3903
      </p>
  
      <p>Thank you for choosing Care Connect for your healthcare needs.</p>
      
      <p>Best regards,<br>
      Billing Department<br>
      Care Connect</p>
      
      <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 0.8em;">
              Care Connect - Empowering Healthcare Organizations<br>
              <a href="https://care-connect-l1ha.onrender.com" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
          </p>
      </div>
  
      <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
          <p>This email contains confidential information. If you received this in error, please notify us immediately.</p>
      </div>
  </body>
  </html>
    `;
};

const generateFacilityPaymentMessage = (facility, patient, paymentDetails) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Care Connect - Patient Discharge Payment</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
      </div>
  
      <h1 style="color: #2563eb; text-align: center;">Patient Discharge Payment</h1>
      
      <p>Dear ${facility.name} Management,</p>
      
      <p>This invoice is for the patient discharge processing and Care Connect system usage fee for the following patient:</p>
      
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Patient Details</h2>
          <p><strong>Patient Name:</strong> ${patient.firstName} ${patient.lastName}</p>
          <p><strong>Patient Contact:</strong><a href="mailto: ${patient.contact.email}"> ${ patient.contact.email} </a> </p>
          <p><strong>Patient Phone:</strong><a href="tel:+233 ${patient.contact.phone}">${patient.contact.phone}</a></p>
          <p><strong>Discharge Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
  
      <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Payment Breakdown</h2>
          <table style="width: 100%; border-collapse: collapse;">
              <tr>
                  <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Description</th>
                  <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: right;">Amount</th>
              </tr>
              <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 10px;">Patient Discharge Processing Fee</td>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: right;">$${paymentDetails.dischargeProcessingFee.toFixed(2)}</td>
              </tr>
              
              <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; font-weight: bold;">Total Amount Due</td>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: right; font-weight: bold;">$${paymentDetails.dischargeProcessingFee.toFixed(2)}</td>
              </tr>
          </table>
      </div>
  
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Payment Instructions</h2>
          <p>To complete the payment for this patient discharge, please click the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
              <a href="${paymentDetails.authorization_url}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Pay Now
              </a>
          </div>
          <p style="color: #dc2626; font-size: 0.9em;">
              <strong>Note:</strong> This payment link will expire in 24 hours. Please complete your payment before the expiration.
          </p>
      </div>
  
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Facility Information</h2>
          <p><strong>Facility Name:</strong> ${facility.name}</p>
          <p><strong>Facility ID:</strong> ${facility.username}</p>
          <p><strong>Contact Email:</strong> ${facility.email}</p>
      </div>
  
      <p>If you have any questions about this invoice or need assistance, please contact our support team:</p>
      <p style="margin-left: 20px;">
          Email: support@careconnect.com<br>
          Phone: +233 24 274 3903
      </p>
  
      <p>Thank you for using Care Connect to manage your facility.</p>
      
      <p>Best regards,<br>
      Billing Department<br>
      Care Connect</p>
      
      <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 0.8em;">
              Care Connect - Empowering Healthcare Organizations<br>
              <a href="https://care-connect-l1ha.onrender.com" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
          </p>
      </div>
  
      <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
          <p>This invoice is for Care Connect system usage and patient discharge processing. Confidential information.</p>
      </div>
  </body>
  </html>
    `;
};
const generateFacilityPaymentApprovedMessage = (facility, patient, paymentDetails) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Care Connect - Patient Discharge Payment Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://res.cloudinary.com/dv2yl5exj/image/upload/v1730564438/facilities_logo/aqqpmcelswgsg7so98da.jpg" alt="Care Connect Logo" style="max-width: 200px; height: auto;">
      </div>
  
      <h1 style="color: #2563eb; text-align: center;">Patient Discharge Service Payment Confirmed</h1>
      
      <p>Dear ${facility.name} Management,</p>
      
      <p>We are writing to confirm that the service charge for patient discharge has been successfully processed.</p>
      
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Patient Details</h2>
          <p><strong>Patient Name:</strong> ${patient.firstName} ${patient.lastName}</p>
          <p><strong>Patient ID:</strong> ${patient.patientId || 'N/A'}</p>
          <p><strong>Discharge Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
  
      <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Payment Confirmation</h2>
          <table style="width: 100%; border-collapse: collapse;">
              <tr>
                  <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Description</th>
                  <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: right;">Amount</th>
              </tr>
              <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 10px;">Patient Discharge Processing Fee</td>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: right;">$${paymentDetails.dischargeProcessingFee.toFixed(2)}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 10px;">Transaction Date</td>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: right;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; font-weight: bold;">Total Paid</td>
                  <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: right; font-weight: bold;">$${paymentDetails.dischargeProcessingFee.toFixed(2)}</td>
              </tr>
          </table>
      </div>
  
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Facility Information</h2>
          <p><strong>Facility Name:</strong> ${facility.name}</p>
          <p><strong>Facility ID:</strong> ${facility.username}</p>
          <p><strong>Contact Email:</strong> ${facility.email}</p>
      </div>
  
      <p>Thank you for using Care Connect to manage your facility's patient discharge process.</p>
      
      <p>Best regards,<br>
      Billing Department<br>
      Care Connect</p>
      
      <div style="margin-top: 40px; border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 0.8em;">
              Care Connect - Empowering Healthcare Organizations<br>
              <a href="https://care-connect-l1ha.onrender.com" style="color: #2563eb; text-decoration: none;">www.careconnect.com</a>
          </p>
      </div>
  
      <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #6b7280;">
          <p>Payment Confirmation for Care Connect System Service Charge</p>
      </div>
  </body>
  </html>
    `;
};

module.exports = {generateFacilityPaymentApprovedMessage,generatePatientPaymentApprovedMessage,generatePatientPaymentMessage, generateFacilityPaymentMessage, generatStaffeWelcomeMessage, generateFacilityWelcomeMessage, generateAppointmentEmail, generateFacilityAppointmentEmail };
