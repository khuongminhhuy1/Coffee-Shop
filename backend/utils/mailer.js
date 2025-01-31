import "dotenv/config.js";
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const options = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
    };
    await transporter.sendMail(options);
    
  } catch (error) {
    console.log("Error while sending email");
    console.log(error.message);
  }
};