// import settingModel from '@/models/setting.model'
import config from '@/tailwind.config.js';
const primaryColor = config.theme.extend.colors.primary['500']; // Primary color of website

export const bookingMailTemplates = [
  {
    id: 1,
    name: 'Aura',
    desc: 'This is the default template for vill abooking confirmation. It has a nice UI.',
    image: '/panel/images/aura.png',
    body: (link, settings) => `<!DOCTYPE html>
    <html>
          <head>
            <meta charset="utf-8">
            <title>Verify your email address</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7f7f7">
              <tbody>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td align="left" style="padding: 40px;">
                            <img src="${settings.website.emailLogo}" alt="${settings.website.name}" width="auto" height="auto">
                            <h1 style="font-size: 24px; margin: 20px 0;">Booking confirmation</h1>
                            <p>Dear Customer,<br>
                              We are pleased to inform you that your booking on ${settings.website.name} has been confirmed.<br>
                              Details of your booking are as follows:<br>
                            </p>
                            <table cellpadding="0" cellspacing="0" border="0" width="auto" bgcolor="${primaryColor}" style="border-radius: 4px;">
                              <tbody>
                                <tr>
                                  <td align="left" style="padding: 10px;">
                                    <a href="${process.env.BASE_URI}${link}" style="font-size: 15px; color: #ffffff; font-weight: 400; text-decoration: none;">View Booking Details</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="font-size: 16px; margin: 20px 0 10px 0;">Best regards,</p>
                            <p style="font-size: 16px; margin: 10px 0;">${settings.website.name} Team</p>
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
