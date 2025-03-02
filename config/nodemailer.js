const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Use email from .env
        pass: process.env.EMAIL_PASS, // Use password from .env
    },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender's email
            to,
            subject,
            text,
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
    }
};

module.exports = sendEmail;
