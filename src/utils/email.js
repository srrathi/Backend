const nodemailer = require('nodemailer');

const email = async (name, mail) => {
  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // activate in gmail "less secure app" option
  });

  // 1) define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: mail,
    subject: 'Welcome to CodeTrophs!',
    text: `Hello ${this.name}.\nWe welcome you to the CodeTrophs Family.\n\nCodeTrophs is an open source project that provides an interactive user interface for beginners and aims at bridging the gap between students and research professors worldwide. Moreover, the platform is acting as a helping hand to individuals who are preparing for the coding interviews, providing them with real live interview experience.\n\nIf you have any questions, please reply to this email. We're always happy to help!\n\nCodeTrophs Team`,
  };

  // 2) create a transport and send email
  await mailTransporter.sendMail(mailOptions);
};

module.exports = email;
