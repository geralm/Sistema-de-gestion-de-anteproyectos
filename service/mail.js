require('dotenv').config()
const nodemailer = require('nodemailer');

// Singleton class to send emails using nodemailer
// OnLy use sendMail method to send emails
class MailService {
    constructor() {
        //IMPORTANTE!! para produccion hay que hacerlo con "Use a CA-Signed Certificate"
        //para cumplir con normas de seguridad de google
        this.transporter = nodemailer.createTransport({
            service: 'Gmail', // Use the email service you want to send emails through
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            secure: false,
            tls: { rejectUnauthorized: false }
        });

    }
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    async _sendMail(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return "Email sent successfully"
        } catch (error) {
            return "Error sending email " + error
        }
    }

}
module.exports.sendMail = async (to, subject, text) => {
    const mailService = MailService.getInstance();
    return await mailService._sendMail(to, subject, text);
}