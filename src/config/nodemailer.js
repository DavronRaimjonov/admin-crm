import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_AUTH_USER,
    pass: process.env.MAILER_AUTH_PASS,
  },
});

export const send_leave_staff_sms = async ({ to, user }) => {
  await transporter.sendMail({
    from: process.env.MAILER_AUTH_USER,
    to,
    subject: "Ta'tildan qaytdi",
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4CAF50;">Ta'tildan qaytgan xodim haqida ma'lumot</h2>
          <p><strong>Ismi:</strong> ${user.first_name} ${user.last_name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Qaytgan sana:</strong> ${new Date().toLocaleDateString()}</p>
          <br/>
          <p style="font-size: 14px; color: #555;">Bu xabar avtomatik yuborildi. Iltimos, tizimni tekshiring.</p>
        </div>
      `,
  });
};
