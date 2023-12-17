import formidable from 'formidable';
import connectDB from "@/conf/database/dbConfig";
import contactsModel from "@/models/contacts.model";
// Database 
connectDB()

// Disable next js body parser
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
// Contact email 
import sendContactEmail from '@/conf/mail/contactEmail'

export default async function handler(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        try {
            // Logics
            if (req.method == 'POST') {
                // Setting update fields >>>>>>>>>>>>>>
                const updateFields = {
                    name: fields.name || '',
                    email: fields.email || '',
                    phone: fields.phone || '',
                    bookingId: fields.bookingId || '',
                    message: fields.message || '',
                    replied: false,
                }
                // Varifying captcha
                try {
                    const response = await fetch(
                        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${fields.captcha}`,
                        {
                            method: 'POST',
                        }
                    );
                    const data = await response.json();
                    if (!data.success) {
                        return res.status(400).json({ error: "Robot 🤖" });
                    }
                } catch (error) {
                    res.status(500).json({ error: "Error verifying captcha" });
                }
                // Creating contact query
                try {
                    const newContact = new contactsModel({ ...updateFields })
                    await newContact.save()
                    // Send contact mail
                    await sendContactEmail(updateFields, 'mohitkumawat310@gmail.com')
                    return res.status(200).json({ success: 'Your message has been submitted successfully. We will be in touch with you soon.' })
                } catch (error) {
                    return res.status(500).json({ error: `Sending message failed. Please try again. ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` })
                }

            } else {
                return res.status(500).json({ error: `You are not allowed to do this.` })
            }
        } catch (error) {
            return res.status(500).json({ error: `Something went wrong :( ${process.env.NODE_ENV == 'dev' && `Error : ${error}`}` });
        }
    })
}
