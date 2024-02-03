//* src/app/utils/sendEmail.ts

import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // smtp host of gmail
    port: 587, // smtp port of gmail
    secure: config.NODE_ENV === 'production',
    auth: {
      // Manage you google account -> Security -> 2-Step Verification -> App passwords -> create
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  await transporter.sendMail({
    from: 'szhldr@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 minutes!', // Subject line
    text: 'Change Password Now ', // plain text body
    html, // html body
  });
};
