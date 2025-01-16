import axios from "axios";


const mailGunApi = process.env.MAILGUN_API_KEY;

// Function to validate email
const checkEmailValidity = async (email) => {
  try {
    const url = 'https://api.mailgun.net/v4/address/validate'; 

    // Make API call
    const response = await axios.post(
      url,
      null, {
        params: {
          address: email,
        },
        auth: {
          username: 'api',
          password: mailGunApi
        }
      }
    );

    // Extract Mailgun response
    const { is_valid, reason, did_you_mean } = response.data;

    if (is_valid) {
      console.log(`Email ${email} is valid.`);
      return true;  // Return true if valid
    } else {
      console.log(`Email ${email} is invalid. Reason: ${reason}`);
      if (did_you_mean) {
        console.log(`Did you mean: ${did_you_mean}`);
      }
      return false;  // Return false if invalid
    }
  } catch (error) {
    console.error('Error validating email:', error.message);
    return false;  // Return false if there's an error
  }
}

export { checkEmailValidity }
