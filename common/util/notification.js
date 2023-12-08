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
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      notificationBody,
      {
        headers: {
          Authorization:
            "key=" +
            "AAAA5kqLEa8:APA91bF5ycQHHy1U7yP_tskNjvWMg-zGqR-6R86S_8Y95uN8tEL99IZIa8jaLAbUdkNGUQLBeaFoh4BdETH9HU0pkJeg3QiewiDRK6P7lrbARAZ0HdxYRlgC38k5DSfe4J3d2y5vMT3Q",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Thành công");
    } else {
      console.log("Lỗi trong quá trình gửi thông báo");
    }
  } catch (err) {
    console.error(err);
  }
}

export default sendNotification;
