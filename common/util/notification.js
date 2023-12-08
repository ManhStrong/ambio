import https from "https";
import { google } from "googleapis";

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

    // Cấu hình thư viện để sử dụng proxy HTTP/HTTPS
    google.options({
      http: {
        agent: new https.Agent({
          proxy: process.env.HTTP_PROXY,
        }),
      },
      https: {
        agent: new https.Agent({
          proxy: process.env.HTTPS_PROXY,
        }),
      },
    });

    // Tạo promise để xử lý yêu cầu HTTPS
    const response = await new Promise((resolve, reject) => {
      const req = https.request(
        "https://fcm.googleapis.com/fcm/send",
        {
          method: "POST",
          headers: {
            Authorization:
              "key=" + "AAAA5kqLEa8:APA91bF5ycQHHy1U7yP_tskNjvWMg-zGqR-sdfds",
            "Content-Type": "application/json",
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resolve({ status: res.statusCode, data });
          });
        }
      );

      req.on("error", (err) => {
        reject(err);
      });

      req.write(JSON.stringify(notificationBody));
      req.end();

      // Thiết lập thời gian timeout cho yêu cầu
      req.setTimeout(10000, () => {
        req.abort(); // Hủy yêu cầu khi timeout
        reject(new Error("Request Timeout"));
      });
    });

    console.log(response, 88888);

    if (response.status === 200) {
      console.log("Thành công");
    } else {
      console.log("Lỗi trong quá trình gửi thông báo");
    }
  } catch (err) {
    console.error(err, 161616);
  }
}

export default sendNotification;
