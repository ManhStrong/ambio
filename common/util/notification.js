import FCM from "fcm-node";
import fetch from "node-fetch";

async function sendNotification(deviceTokenCFM) {
  const notification = {
    title: "Ambio notification414",
    text: "Text",
  };
  console.log(deviceTokenCFM, 6666);

  const fcmToken = [deviceTokenCFM];
  const notificationBody = {
    notification: notification,
    registration_ids: fcmToken,
  };
  console.log(notificationBody, 78787);

  try {
    console.log(1234567889);
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization:
          "key=" +
          "AAAA5kqLEa8:APA91bF5ycQHHy1U7yP_tskNjvWMg-zGqR-6R86S_8Y95uN8tEL99IZIa8jaLAbUdkNGUQLBeaFoh4BdETH9HU0pkJeg3QiewiDRK6P7lrbARAZ0HdxYRlgC38k5DSfe4J3d2y5vMT3Q",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationBody),
    });
    console.log(response, 88888);

    if (response.ok) {
      console.log("Thành công");
    } else {
      console.log("Lỗi trong quá trình gửi thông báo");
    }
  } catch (err) {
    console.error(err, 161616);
  }
}

export default sendNotification;
