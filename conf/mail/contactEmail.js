import settingModel from '@/models/settings.model'
import transporters from './emailConfig'
import { contactMailTemplate } from './templates/contactMailTemplate';

async function contactMail(contact, to) {
    try {
        // Fetch settings
        const settings = await settingModel.findOne().lean();
        // Message
        const message = {
            from: `Inquiry Mail <${process.env.NO_REPLY_MAIL_USER}>`, // sender address
            to: to, // list of receivers
            subject: `Email From ${settings.website.name} website`, // Subject line
            html: contactMailTemplate[0].body(contact, settings),
        };
        try {
            await transporters.noReplyTransporter.sendMail(message);
            return true;
        } catch (error) {
            console.log(error)
            return true;
        }
    } catch (error) {
        console.log(error)
        return true;
    }
}

export default contactMail;