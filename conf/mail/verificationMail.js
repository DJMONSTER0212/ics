import settingModel from '@/models/settings.model'
import transporters from './emailConfig'
import { otpMailTemplates } from './templates/otpMailTemplate';
import { linkMailTemplates } from './templates/linkMailTemplate';

async function verificationMail(name, to, code) {
    try {
        // Fetch settings
        const settings = await settingModel.findOne().lean();
        // Checking verification method and template
        let verificationTemplate;
        if (settings.login.verificationMethod == 'otp') {
            verificationTemplate = otpMailTemplates.find((template) => { return template.id == settings.login.otpMailTemplate }).body(name, code, settings)
        } else {
            verificationTemplate = linkMailTemplates.find((template) => { return template.id == settings.login.linkMailTemplate }).body(name, code, settings)
        }
        // Message
        const message = {
            from: `Verification mail <${process.env.NO_REPLY_MAIL_USER}>`, // sender address
            to: to, // list of receivers
            subject: `Verification mail From ${settings.website.name}`, // Subject line
            html: verificationTemplate,
        };
        try {
            await transporters.noReplyTransporter.sendMail(message);
            return true;
        } catch (error) {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export default verificationMail;