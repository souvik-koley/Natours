const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// const Transport = require('nodemailer-brevo-transport');


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Souvik Koley <${process.env.EMAIL_FROM}>`;
    };

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return nodemailer.createTransport({
                // service: 'Brevo',
                host: process.env.SENDINBLUE_HOST,
                port: process.env.SENDINBLUE_PORT,
                auth: {
                    user: process.env.SENDINBLUE_LOGIN,
                    pass: process.env.SENDINBLUE_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    };

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        }

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    };

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family');
    };
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your Password Reset Token (valid for only 10 minutes)');
    }

};

// const sendEmail = async options => {
//     // 1) Create a transporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });

//     // 2) Define the email options
//     const mailOptions = {
//         from: 'Souvik Koley <admin@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: options.html
//     }

//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions);
// }

// module.exports = sendEmail;