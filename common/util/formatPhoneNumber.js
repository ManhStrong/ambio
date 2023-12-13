function formatPhoneNumber(phoneNumber) {
  const cleanedNumber = phoneNumber.replace(/^0+/, "");
  const formattedNumber = "+84" + cleanedNumber;
  return formattedNumber;
}
module.exports = formatPhoneNumber;
