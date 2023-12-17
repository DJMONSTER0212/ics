import settingModel from '@/models/settings.model'
import transporters from './emailConfig'
import { bookingMailTemplates } from './templates/bookingConfirmationTemplate';

async function bookingMail(link, to) {
    try {
        // Fetch settings
        const settings = await settingModel.findOne().lean();
        // Message
        const message = {
            from: `Booking confirmation Mail <${process.env.NO_REPLY_MAIL_USER}>`, // sender address
            to: to, // list of receivers
            subject: `Booking confirmation mail From ${settings.website.name} website`, // Subject line
            html: bookingMailTemplates[0].body(link, settings),
        };
        try {
            await transporters.noReplyTransporter.sendMail(message);
            return true;
        } catch (error) {
            return true;
        }
    } catch (error) {
        return true;
    }
}

export default bookingMail;