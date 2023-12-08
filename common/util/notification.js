import axios from "axios";

async function sendNotification(deviceTokenCFM) {
  console.log(deviceTokenCFM, "hahahahh");
  const notification = {
    title: "Ambio notification",
    body: "Có thiết bị đang đănh nhập tài khoản của bạn",
  };

  const fcmToken = [deviceTokenCFM];
  const notificationBody = {
    notification: notification,
    registration_ids: fcmToken,
  };

  try {
    await axios
      .post("https://fcm.googleapis.com/fcm/send", notificationBody, {
        headers: {
          Authorization:
            "key=" +
            "AAAA5kqLEa8:APA91bF5ycQHHy1U7yP_tskNjvWMg-zGqR-6R86S_8Y95uN8tEL99IZIa8jaLAbUdkNGUQLBeaFoh4BdETH9HU0pkJeg3QiewiDRK6P7lrbARAZ0HdxYRlgC38k5DSfe4J3d2y5vMT3Q",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Thanh cong");
      })
      .catch((err) => {
        console.log("that bai");
      });
  } catch (err) {
    console.error(err);
  }
}

export default sendNotification;
