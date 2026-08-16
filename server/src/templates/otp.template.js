export const generateOTPTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <style>
          body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f8f9fa;
              color: #000;
              margin: 0;
              padding: 40px 20px;
          }
          .wrapper {
              max-width: 500px;
              margin: 0 auto;
          }
          .header {
              background-color: #FF90E8;
              border: 4px solid #000;
              border-bottom: 0;
              padding: 20px;
              text-align: center;
          }
          .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: -1px;
          }
          .container {
              background: #ffffff;
              border: 4px solid #000;
              padding: 40px 30px;
              box-shadow: 8px 8px 0 0 #000;
              text-align: center;
              margin-bottom: 40px;
          }
          .message {
              font-size: 18px;
              font-weight: 700;
              line-height: 1.5;
              margin-bottom: 30px;
          }
          .otp-code {
              font-size: 40px;
              font-family: monospace;
              font-weight: 900;
              color: #000;
              letter-spacing: 12px;
              background-color: #FDE047;
              padding: 15px 15px 15px 27px; /* Extra left padding to center with letter-spacing */
              border: 4px solid #000;
              box-shadow: 4px 4px 0 0 #000;
              display: inline-block;
              margin-bottom: 30px;
          }
          .footer-note {
              font-size: 14px;
              font-weight: 700;
              color: #444;
          }
          .footer {
              text-align: center;
              font-size: 12px;
              font-weight: 800;
              color: #000;
              text-transform: uppercase;
          }
      </style>
  </head>
  <body>
      <div class="wrapper">
          <div class="header">
              <h1>ShareFlow</h1>
          </div>
          <div class="container">
              <div class="message">
                  Let's get you verified!<br><br>
                  Enter the 4-digit code below to verify your account and dive into your dashboard.
              </div>
              <div class="otp-code">${otp}</div>
              <div class="footer-note">
                  Didn't request this? You can safely ignore this email.
              </div>
          </div>
          <div class="footer">
              &copy; ${new Date().getFullYear()} ShareFlow. All rights reserved.
          </div>
      </div>
  </body>
  </html>
  `;
};
