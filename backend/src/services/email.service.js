const nodemailer = require("nodemailer");

const hasEmailConfig = () =>
  Boolean(
    process.env.GMAIL_USER &&
    process.env.GMAIL_APP_PASSWORD
  );

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, ""),
    },
  });

const sendEmail = async ({ to, subject, text, html }) => {
  if (!hasEmailConfig()) {
    console.warn("Email configuration missing.");

    return {
      sent: false,
      reason: "EMAIL_NOT_CONFIGURED",
    };
  }

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"SplitNest" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return {
      sent: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email Send Error:", error);

    return {
      sent: false,
      reason: error.message,
    };
  }
};

const sendVerificationEmail = (email, fullName, otp) =>
  sendEmail({
    to: email,
    subject: "SplitNest - Email Verification OTP",
    text: `Hello ${fullName}, your verification OTP is ${otp}.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px">
        <h2 style="color:#2563eb">Welcome to SplitNest</h2>

        <p>Hello <b>${fullName}</b>,</p>

        <p>Your verification OTP is:</p>

        <h1 style="
          background:#2563eb;
          color:white;
          padding:15px;
          text-align:center;
          border-radius:8px;
          letter-spacing:8px;">
          ${otp}
        </h1>

        <p>This OTP is valid for <b>10 minutes</b>.</p>

        <p>If you didn't create this account, ignore this email.</p>

        <hr>

        <small>© SplitNest</small>
      </div>
    `,
  });

const sendVerificationCode = (email, otp, fullName) =>
  sendVerificationEmail(email, fullName, otp);

/*
  Forgot Password using RESET LINK
*/
const sendForgotPasswordEmail = (
  email,
  fullName,
  resetUrl
) =>
  sendEmail({
    to: email,
    subject: "SplitNest Password Reset",
    text: `Reset your password using this link: ${resetUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px">

        <h2 style="color:#dc2626">
          Reset Your Password
        </h2>

        <p>Hello <b>${fullName}</b>,</p>

        <p>
          We received a request to reset your SplitNest password.
        </p>

        <p>
          Click the button below.
        </p>

        <div style="text-align:center;margin:35px 0;">
          <a
            href="${resetUrl}"
            style="
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              padding:14px 28px;
              border-radius:8px;
              display:inline-block;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This link will expire in
          <b>15 minutes</b>.
        </p>

        <p>
          If you didn't request this password reset,
          you can safely ignore this email.
        </p>

        <hr>

        <small>
          © SplitNest
        </small>

      </div>
    `,
  });

module.exports = {
  sendEmail,
  sendVerificationCode,
  sendVerificationEmail,
  sendForgotPasswordEmail,
};