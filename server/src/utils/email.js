import nodemailer from "nodemailer"
import {SESv2Client, SendEmailCommand} from "@aws-sdk/client-sesv2"

const sesClient = new SESv2Client({
    region : process.env.AWS_SES_REGION
})

const transporter = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});

export const sendMail = async (email, subject, htmlTemplate) => {
    const info = await transporter.sendMail({
        from : process.env.EMAIL,
        to : email,
        subject : subject,
        html : htmlTemplate
    })
    console.log("Message sent successfully", info);
    return info;
}