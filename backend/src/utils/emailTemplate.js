// email.templates.js
const emailHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; }
        .email-container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
        .header { background-color: #4CAF50; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; text-align: center; color: #333; }
        .verification-code { background-color: #f3f3f3; padding: 15px; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        a { color: #4CAF50; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <h2>Hello [User],</h2>
            <p>Thank you for registering with us! To complete your registration, please verify your email by entering the code below:</p>
            <div class="verification-code">[Verification Code]</div>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Sulav Ghar Ghadari. All rights reserved.</p>
            <p>If you have any questions, feel free to <a href="bishalrajbanshi.in@gmail.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
`;

export { emailHtmlContent };
