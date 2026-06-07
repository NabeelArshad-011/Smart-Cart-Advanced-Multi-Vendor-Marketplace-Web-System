const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const host = process.env.SMTP_HOST || process.env.SMPT_HOST;
    const port = Number(process.env.SMTP_PORT || process.env.SMPT_PORT || 465);
    const service = process.env.SMTP_SERVICE || process.env.SMPT_SERVICE;
    const user = process.env.SMTP_MAIL || process.env.SMPT_MAIL;
    const pass = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD;

    const transportConfig = service
        ? {
            service,
            auth: {
                user,
                pass,
            },
        }
        : {
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        };

    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
        from: user,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;