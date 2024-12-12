export const emailHtmlContent = ({ fullName, verificationCode }) => `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 700px;
        width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }
      .email-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .email-header h2 {
        color: #2C3E50;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .email-body {
        text-align: center;
        font-size: 16px;
        color: #333333;
      }
      .verification-code {
        font-size: 24px;
        font-weight: bold;
        color: #27ae60;
        padding: 10px 20px;
        border-radius: 5px;
        border: 2px solid #27ae60;
        display: inline-block;
        margin: 20px 0;
      }
      .email-footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
      .email-footer p {
        margin: 5px 0;
      }
      @media only screen and (max-width: 600px) {
        .email-container {
          padding: 15px;
        }
        .email-header h2 {
          font-size: 20px;
        }
        .verification-code {
          font-size: 20px;
          padding: 8px 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Welcome to Sulav Ghar Gharadi</h2>
      </div>
      <div class="email-body">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Thank you for choosing Sulav Ghar Gharadi. Please use the verification code below:</p>
        <div class="verification-code">
          ${verificationCode}
        </div>
        <p>If you did not request this code, you can safely ignore this email. For any assistance, feel free to reach out to our support team.</p>
      </div>
      <div class="email-footer">
        <p>Best regards,</p>
        <p><strong>Sulav Ghar Gharadi Team</strong></p>
        <hr style="border: none; border-top: 1px solid #e0e0e0;">
        <p>This email was sent by Sulav Ghar Gharadi. Please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
  </html>
`;
