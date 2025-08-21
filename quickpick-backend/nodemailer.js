import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('USER:', process.env.EMAIL_USER);
console.log('PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Test email body',
})
.then(() => console.log('Email sent'))
.catch(err => console.error('Email error:', err));


export default nodemailer;