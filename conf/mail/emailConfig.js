import nodemailer from 'nodemailer'

const transporters = {
    // No reply transporter
    noReplyTransporter: nodemailer.createTransport({
        name: process.env.NO_REPLY_MAIL_HOST,
        host: process.env.NO_REPLY_MAIL_HOST,
        port: process.env.NO_REPLY_MAIL_PORT,
        secure: process.env.NO_REPLY_MAIL_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.NO_REPLY_MAIL_USER,
            pass: process.env.NO_REPLY_MAIL_PASSWORD
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    }),
}
export default transporters;