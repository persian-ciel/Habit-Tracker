import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendReminderEmail(
  to: string,
  title: string,
  dueDate: string
) {
  await transporter.sendMail({
    from: `"Todo App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "⏰ Task deadline is approaching",
    html: `
      <h2>Reminder</h2>
      <p>Your task <b>${title}</b> is almost due.</p>
      <p>Deadline: <b>${new Date(dueDate).toLocaleString()}</b></p>
      <p>Please make sure to complete it on time 💪</p>
    `,
  });
}
