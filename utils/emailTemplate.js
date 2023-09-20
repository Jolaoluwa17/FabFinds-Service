const supportTeam = "olusanyajolaoluwa17@gmail.com";
const emailTemplate = (generatedOtp, userName) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>
    <style type="text/css">
      .container {
        height: 520px;
        width: 500px;
         background-color: white; 
        padding: 10px;
      }
      .header {
        font-size: 24px;
        font-weight: 600;
        font-style: italic;
        margin-bottom: 30px;
      }
      .content-container {
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        width: 400px;
        height: 300px;
        text-align: left;
        padding: 10px;
      }
      .intro {
        font-weight: 600;
        margin-bottom: 10px;
      }
      .content {
        line-height: 1.3; /* Adjust this value to increase or decrease line spacing */
        color: #7a7a7a;
      }
      .otp-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 20px;
      }
      .otp {
        width: 200px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        border-radius: 5px;
        color: black;
        text-align: center;
        font-size: 25px;
        font-weight: 600;
      }
      .footer {
        margin-top: 20px;
        width: 400px;
        text-align: left;
        font-size: 12px;
      }
      p {
        font-size: 12px;
      }
      hr {
        border: none; /* Remove the default border */
        height: 1px; /* Adjust the height as needed */
        background-color: #7a7a7a; /* Set the desired background color */
      }
    </style>
  </head>
  <body>
    <center class="wrapper">
      <div class="container">
        <div class="header">FabFinds</div>
        <div class="content-container">
          <div class="intro">Hi, ${userName}</div>
          <div class="content">
            You recently requested to reset your FabFinds account password. Use
            the OTP below to reset it.
            <b>This OTP is only valid for 2 minutes.</b>
          </div>
          <div class="otp-container">
            <div class="otp">${generatedOtp}</div>
          </div>
          <div class="content">
            If you did not request a password reset, please ignore this email or
            <a href="mailto:${supportTeam}">contact support</a> if you have any questions.
          </div>
          <br />
          <div class="content">
            Thank, <br />
            The FabFinds Team
          </div>
        </div>
        <div class="footer">
          If you are having any issues you can contact us on through the
          following.
        </div>
        <br />
        <hr />
        <br />
        <p>@2023 FabFinds. All rights reserved.</p>
      </div>
    </center>
  </body>
</html>
`;

module.exports = { emailTemplate };
