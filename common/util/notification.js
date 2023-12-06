const FCM = require("fcm-node");
function sendNotification(deviceTokenCFM) {
  const serverKey =
    "AAAA5kqLEa8:APA91bF5ycQHHy1U7yP_tskNjvWMg-zGqR-6R86S_8Y95uN8tEL99IZIa8jaLAbUdkNGUQLBeaFoh4BdETH9HU0pkJeg3QiewiDRK6P7lrbARAZ0HdxYRlgC38k5DSfe4J3d2y5vMT3Q";
  const fcm = new FCM(serverKey);
  const message = {
    to: deviceTokenCFM,
    notification: {
      title: "Ambio Notification",
      body: "Có thiết bị đang đăng nhập tài khoản của bạn",
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
}
module.exports = sendNotification;
