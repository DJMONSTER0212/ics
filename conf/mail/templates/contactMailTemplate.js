// import settingModel from '@/models/setting.model'
import config from '@/tailwind.config.js';
const primaryColor = config.theme.extend.colors.primary['500']; // Primary color of website

// Fetch settings
// let settings;
// (async () => {
//   settings = await settingModel.findOne().lean();;
// })();
export const contactMailTemplate = [
  {
    id: 1,
    name: 'Default theme',
    desc: 'This is the default template for contact.',
    image: '/panel/images/horizon.png',
    body: (contact, settings) => `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New enquiry</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7f7f7">
              <tbody>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td align="center" style="padding: 40px;">
                            <img src="${settings.website.emailLogo}" alt="${settings.website.name}" width="100" height="100">
                            <p style="font-size: 20px; margin-top: 20px;">Hi ${settings.website.name},</p>
                            <h1 style="font-size: 24px; margin-bottom: 20px;">You have received a new inquiry from:</h1>
                            <table cellpadding="0" cellspacing="0" border="0" bgcolor="#dddddd" style="border-radius: 4px; padding: 20px; width: 100%;">
                            <tbody>
                                <tr>
                                    <td>Name:</td>
                                    <td class="content">${contact.name}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td class="content">${contact.email}</td>
                                </tr>
                                <tr>
                                    <td>Phone Number:</td>
                                    <td class="content">${contact.phone}</td>
                                </tr>
                                <tr>
                                    <td>Booking ID:</td>
                                    <td class="content">${contact.bookingId}</td>
                                </tr>
                                <tr>
                                    <td>Message:</td>
                                    <td class="content">${contact.message}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
        `
  },
]
