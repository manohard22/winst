import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (userEmail, userName, technology) => {
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER === "test@example.com"
  ) {
    console.log("Email not configured - skipping welcome email");
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Welcome to Lucro - Registration Successful",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2557a7; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to Lucro!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${userName},</p>
          <p>Thank you for registering with Lucro. Your account has been created successfully.</p>
          <p><strong>Program:</strong> ${technology}</p>
          <p>You can now log in to your dashboard and start your learning journey.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Next Steps:</h3>
            <ul>
              <li>Complete your payment to activate your internship</li>
              <li>Access your learning materials</li>
              <li>Connect with your assigned mentor</li>
              <li>Start working on your first assignment</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>Lucro Team</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 Lucro. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
  }
};

export const sendCertificateEmail = async (
  userEmail,
  userName,
  technology,
  certificateUrl
) => {
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER === "test@example.com"
  ) {
    console.log("Email not configured - skipping certificate email");
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Congratulations! Your Lucro Certificate is Ready",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2557a7; color: white; padding: 20px; text-align: center;">
          <h1>🎉 Congratulations!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${userName},</p>
          <p>Congratulations on successfully completing your <strong>${technology}</strong> internship program!</p>
          <p>Your dedication and hard work have paid off. You have demonstrated excellent skills and commitment throughout the program.</p>
          <div style="background-color: #e7f1ff; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3>Your Certificate is Ready!</h3>
            <p>You can download your certificate from your dashboard or use the link below:</p>
            <a href="${certificateUrl}" style="background-color: #2557a7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Certificate</a>
          </div>
          <p>This certificate validates your skills and can be shared with potential employers or added to your professional profiles.</p>
          <p>We wish you all the best in your future endeavors!</p>
          <p>Best regards,<br>Lucro Team</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 Lucro. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Certificate email sent successfully");
  } catch (error) {
    console.error("Certificate email error:", error);
  }
};
