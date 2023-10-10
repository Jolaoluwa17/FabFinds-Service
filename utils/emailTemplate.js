const supportTeam = "olusanyajolaoluwa17@gmail.com";
const emailTemplate = (generatedOtp, userName) => `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title></title>

    <link
      href="https://fonts.googleapis.com/css?family=Roboto:400,600"
      rel="stylesheet"
      type="text/css"
    />

    <style>
      html,
      body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        font-family: "Roboto", sans-serif !important;
        font-size: 13px;
        margin-bottom: 10px;
        line-height: 24px;
        color: #7a7a7a;
        font-weight: 400;
      }
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
      }
      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }
      table table table {
        table-layout: auto;
      }
      a {
        text-decoration: none;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
    </style>
  </head>

  <body
    width="100%"
    style="
      margin: 0;
      padding: 0 !important;
      mso-line-height-rule: exactly;
      background-color: #f5f6fa;
    "
  >
    <center style="width: 100%; background-color: #f5f6fa">
      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        bgcolor="#f5f6fa"
      >
        <tr>
          <td style="padding: 40px 0">
            <table style="width: 100%; max-width: 620px; margin: 0 auto">
              <tbody>
                <tr>
                  <td style="text-align: center; padding-bottom: 25px">
                    <a href="#">
                      <img
                        src="https://res.cloudinary.com/dvv4wwuk1/image/upload/v1696921393/TechGate/default_v9uirf.png"
                        alt=""
                        style="width: 50px; height: 50px; border-radius: 50%"
                    /></a>
                    <p
                      style="
                        font-size: 20px;
                        color: black;
                        padding-top: 12px;
                        font-weight: 700;
                      "
                    >
                      TECHGATE
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              style="
                width: 100%;
                max-width: 620px;
                margin: 0 auto;
                background-color: #ffffff;
              "
            >
              <tbody>
                <tr>
                  <td style="text-align: center; padding: 30px 30px 15px 30px">
                    <h2
                      style="
                        font-size: 16px;
                        color: black;
                        font-weight: 600;
                        margin: 0;
                      "
                    >
                      Reset Password
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 0 30px 20px">
                    <p style="margin-bottom: 10px; text-align: left; font-weight: 600; font-size: 14px; color: black;">
                      Hi ${userName},
                    </p>
                    <p style="margin-bottom: 25px; text-align: left; font-size: 13px;">
                      You recently requested to reset your FabFinds account
                      password. Use the OTP below to reset it.
                      <b>This OTP is only valid for 2 minutes.</b>
                    </p>
                    <a
                      href="#"
                      style="
                        background-color: #925de3;
                        border-radius: 4px;
                        color: #ffffff;
                        display: inline-block;
                        font-size: 15px;
                        font-weight: 600;
                        line-height: 44px;
                        text-align: center;
                        text-decoration: none;
                        text-transform: uppercase;
                        padding: 0 25px;
                        letter-spacing: 2px;
                      "
                      >${generatedOtp}</a
                    >
                  </td>
                </tr>
                <tr>
                  <td style="text-align: left; padding: 20px 30px 40px">
                    <p style="font-size: 13px;">
                      If you did not request a password reset, please ignore
                      this email or
                      <a href="#" style="color: #925de3; text-decoration: none"
                        >contact support</a
                      >
                      if you have any questions.
                    </p>
                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        line-height: 22px;
                        color: #9ea8bb;
                        margin-top: 10px;
                      "
                    >
                      Thank you, <br />
                      From FabFinds Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table style="width: 100%; max-width: 620px; margin: 0 auto">
              <tbody>
                <tr>
                  <td style="text-align: center; padding: 25px 20px 0">
                    <p style="font-size: 12px">
                      Copyright © 2023 FabFinds. All rights reserved. <br />
                      University Companion App
                    </p>
                    <ul style="margin: 10px -4px 0; padding: 0">
                      <li
                        style="
                          display: inline-block;
                          list-style: none;
                          padding: 4px;
                        "
                      >
                        <a href="#"
                          ><img
                            style="width: 30px"
                            src="https://res.cloudinary.com/dvv4wwuk1/image/upload/v1696927983/TechGate/icons8-twitter-48_gpkwzk.png"
                            alt="brand"
                        /></a>
                      </li>
                      <li
                        style="
                          display: inline-block;
                          list-style: none;
                          padding: 4px;
                        "
                      >
                        <a href="#"
                          ><img
                            style="width: 30px"
                            src="https://res.cloudinary.com/dvv4wwuk1/image/upload/v1696928125/TechGate/icons8-instagram-48_jdwo6b.png"
                            alt="brand"
                        /></a>
                      </li>
                      <li
                        style="
                          display: inline-block;
                          list-style: none;
                          padding: 4px;
                        "
                      >
                        <a href="#"
                          ><img
                            style="width: 30px"
                            src="https://res.cloudinary.com/dvv4wwuk1/image/upload/v1696928206/TechGate/icons8-whatsapp-48_cfncfp.png"
                            alt="brand"
                        /></a>
                      </li>
                    </ul>
                    <p style="padding-top: 15px; font-size: 12px">
                      This email was sent to you as a registered user of
                      <a style="color: #925de3; text-decoration: none" href=""
                        >FabFinds website</a
                      >. To update your emails preferences
                      <a style="color: #925de3; text-decoration: none" href="#"
                        >click here</a
                      >.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;

module.exports = { emailTemplate };
