// import settingModel from '@/models/setting.model'
import config from '@/tailwind.config.js';
const primaryColor = config.theme.extend.colors.primary['500']; // Primary color of website

export const otpMailTemplates = [
  {
    id: 1,
    name: 'Aura',
    desc: 'This is the default template for otp. It has a nice UI.',
    image: '/panel/images/aura.png',
    body: (name, code, settings) => `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Email Verification</title>
            <style>
            /* Styling for the main content area */
            table.container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #f8f8f8;
                border: none;
                border-radius: 8px;
                padding: 20px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
            }
            
            /* Styling for the company logo */
            td.logo {
                text-align: center;
                padding-bottom: 20px;
            }
            
            /* Styling for the OTP section */
            td.otp {
                padding-top: 20px;
                padding-bottom: 20px;
                text-align: center;
                font-weight: bold;
                font-size: 24px;
                color: #333;
                background-color: #fff;
                border-radius: 8px;
            }
            
            /* Styling for the footer */
            td.footer {
                text-align: center;
                padding-top: 20px;
                color: #666;
                font-size: 12px;
            }
            </style>
        </head>
        <body>
            <table class="container">
            <tr>
                <td class="logo">
                <img src="${settings.website.emailLogo}" alt="${settings.website.name}" style="max-width: 30%;">
                </td>
            </tr>
            <tr>
                <td>
                <p>Dear ${name} ,</p>
                <p>Thank you for registering with our service. Please use the following OTP to verify your email address:</p>
                </td>
            </tr>
            <tr>
                <td class="otp">
                ${code}
                </td>
            </tr>
            <tr>
                <td class="footer">
                <p>&copy; 2023 ${settings.website.name}. All rights reserved. | <a href="${process.env.BASE_URI}">Visit our website</a></p>
                </td>
            </tr>
            </table>
        </body>
        </html>`
  },
  {
    id: 2,
    name: 'Harmony',
    desc: 'A modern mail template with a nice UI.',
    image: '/panel/images/harmony.png',
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
                            <img src="${settings.website.lightLogo}" alt="${settings.website.name}" width="100" height="100">
                            <h1 style="font-size: 24px; margin: 20px 0;">Verify your email address</h1>
                            <p style="font-size: 16px; margin: 20px 0;">Hi ${name},</p>
                            <p style="font-size: 16px; margin: 20px 0;">Thank you for signing up for ${settings.website.name}. To complete your registration, please enter the following OTP:</p>
                            <table cellpadding="0" cellspacing="0" border="0" width="200" bgcolor="${primaryColor}" style="border-radius: 4px;">
                              <tbody>
                                <tr>
                                  <td align="center" style="padding: 10px;">
                                    <span style="font-size: 20px; color: #ffffff; font-weight: bold;">${code}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="font-size: 16px; margin: 20px 0;">If you did not request this verification, you can safely ignore this email.</p>
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
