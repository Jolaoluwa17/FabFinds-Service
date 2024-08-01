const supportTeam = 'olusanyajolaoluwa17@gmail.com';
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

  <body width="100%" style="margin: 0; padding: 0; background-color: #f5f6fa">
    <center style="width: 100%; background-color: #f5f6fa">
      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        bgcolor="#f5f6fa"
      >
        <tr>
          <td style="padding: 50px 0">
            <table
              style="
                width: 100%;
                max-width: 620px;
                margin: 0 auto;
                background-color: #ffffff;
              "
            >
              <tbody>
                <tr
                  style="
                    border-bottom-color: #e7e7e7;
                    border-bottom-width: 1px;
                    border-bottom-style: solid;
                  "
                >
                  <td style="text-align: left; padding: 16px 32px">
                    <img
                      src="https://res.cloudinary.com/dvv4wwuk1/image/upload/v1713447753/TechGate/Acadu_2_opbyfh.png"
                      alt=""
                      style="width: 99.2px; height: 24px"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 44px 32px">
                    <p
                      style="
                        margin-bottom: 10px;
                        text-align: left;
                        font-weight: 700;
                        font-size: 24px;
                        color: black;
                      "
                    >
                      Hello ${userName},
                    </p>
                    <p
                      style="
                        margin-bottom: 24px;
                        text-align: left;
                        font-size: 16px;
                        color: black;
                      "
                    >
                      To reset your password, please use the following one-time
                      verification code (OTP):
                    </p>
                    <a
                      href="#"
                      style="
                        text-align: center;
                        color: black;
                        font-size: 36px;
                        font-weight: 700;
                        width: 100%;
                        letter-spacing: 5px;
                      "
                      >${generatedOtp}</a
                    >
                    <p
                      style="
                        font-size: 16px;
                        color: black;
                        text-align: left;
                        margin-top: 24px;
                      "
                    >
                      Once entered, you can create a new password and regain
                      access to your Acadu account. Need help? Contact us at
                      <a
                        href="#"
                        style="
                          color: #0668fd;
                          text-decoration: none;
                          font-weight: 700;
                        "
                        >info@acadu.com</a
                      >
                    </p>
                    <p
                      style="
                        margin-top: 56px;
                        color: black;
                        font-weight: 700;
                        font-size: 16px;
                        text-align: left;
                      "
                    >
                      Best regards, <br />
                      The Acadu Team
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background: #f5f6fa">
                    <img
                      src="https://res.cloudinary.com/dvv4wwuk1/image/upload/v1713448955/TechGate/Frame_289774_ietlu3.png"
                      alt=""
                      style="width: 100%; height: 21px"
                    />
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
