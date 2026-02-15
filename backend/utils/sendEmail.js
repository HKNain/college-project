import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    await transporter.sendMail({
      from: `"Student Marks" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

export default sendEmail;
