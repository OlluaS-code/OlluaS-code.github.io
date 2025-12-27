import { config } from "../settings/config";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

interface EmailData {
  email: string;
  name: string;
  message: string;
  attach?: Express.Multer.File;
}

export default ({ email, name, message, attach }: EmailData): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: config.EMAIL_SECURE === true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: Mail.Options = {
    from: config.EMAIL_USER,
    to: config.EMAIL_USER,
    replyTo: email,
    subject: `${name} sent you a message`,
    text: `- Name: ${name}\n- Email: ${email}\n- Message: ${message}`,
  };

  if (attach) {
    mailOptions.attachments = [
      {
        filename: attach.originalname,
        content: attach.buffer,
      },
    ];
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      transporter.close();
      if (error) return reject(error);
      resolve();
    });
  });
};
