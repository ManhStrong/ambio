const dotenv = require("dotenv");
dotenv.config();
const accoutSID = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;
const client = require("twilio")(accoutSID, token);
const sendSMS = async (body, toPhoneNumber) => {
  let messageOptions = {
    from: process.env.TWILIO_PHONENUMBER,
    to: toPhoneNumber,
    body,
  };
  try {
    const message = await client.messages.create(messageOptions);
    console.log(message);
  } catch (error) {
    console.log(error, 9999);
  }
};
export default sendSMS;
