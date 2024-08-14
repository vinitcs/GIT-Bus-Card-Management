import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"GIT Bus Card Admin" <busmanagement2023@gmail.com>`,
    to,
    subject,
    html,
  });
};
