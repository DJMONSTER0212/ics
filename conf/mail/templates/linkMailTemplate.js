// import settingModel from '@/models/setting.model'
import config from '@/tailwind.config.js';
const primaryColor = config.theme.extend.colors.primary['500']; // Primary color of website

// Fetch settings
// let settings;
// (async () => {
//   settings = await settingModel.findOne().lean();;
// })();
export const linkMailTemplates = [
  {
    id: 1,
    name: 'Horizon',
    desc: 'This is the default template for link. It has a nice UI.',
    image: '/panel/images/horizon.png',
    body: (name, code, settings) => `<!DOCTYPE html>
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
                          <td align="center" style="padding: 40px;">
                            <img src="${settings.website.emailLogo}" alt="${settings.website.name}" width="100" height="100">
                            <h1 style="font-size: 24px; margin: 20px 0;">Verify your email address</h1>
                            <p style="font-size: 16px; margin: 20px 0;">Hi ${name},</p>
                            <p style="font-size: 16px; margin: 20px 0;">Thank you for signing up for ${settings.website.name}. To complete your registration, please enter click on the following link:</p>
                            <table cellpadding="0" cellspacing="0" border="0" width="200" bgcolor="${primaryColor}" style="border-radius: 4px;">
                              <tbody>
                                <tr>
                                  <td align="center" style="padding: 10px;">
                                    <a href="${process.env.BASE_URI}api/auth/verifyemail/${code}" style="font-size: 20px; color: #ffffff; font-weight: bold;">Verify now</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="font-size: 16px; margin: 20px 0;">Best regards,</p>
                            <p style="font-size: 16px; margin: 20px 0;">${settings.website.name} Team</p>
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
