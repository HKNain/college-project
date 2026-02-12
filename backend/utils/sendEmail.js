import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "gmail",
      port: 587,
      // secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Student Marks" <${process.env.EMAIL_USER}>`,
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
