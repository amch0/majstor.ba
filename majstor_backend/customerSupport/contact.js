const nodemailer = require("nodemailer");
const emailConfig = require("../emailConfig");

const contact = async (req, res) => {
  // console.log(req.body);
  const { name, email, phone_number, message } = req.body;

  const transporter = nodemailer.createTransport(emailConfig);

  // Set up the email options
  const mailOptions = {
    from: "elhapvc@gmail.com",
    to: "elhapvc@gmail.com",
    subject: `Customer Support Message ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phone_number}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.log(error);
      res.send("There was an error sending the email.");
    } else {
      // console.log(`Email sent: ${info.response}`);
      res.send("Your message was sent successfully!");
    }
  });
};

module.exports = contact;
