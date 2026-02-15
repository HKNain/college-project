import axios from "axios";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Student Marks",
          email: process.env.SMTP_SENDER || process.env.SMTP_USER,
        },
        to: Array.isArray(to)
          ? to.map((email) => ({ email }))
          : [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Email error:", error.response?.data || error.message);
    throw error;
  }
};

export default sendEmail;
