import db from "../models";
import generateRandomNumber from "../common/util/random";
import generateRandomString from "../common/util/randomString";
import bcrypt from "bcryptjs";
import moment from "moment";
import { getRedis, setRedis } from "../lib/redis/redisService";
import {
  findByConditions,
  findOrCreate,
  createRecord,
  updateRecord,
  destroyRecord,
} from "../lib/mysql/baseModel";
import sendSMS from "../lib/sms/senVerifyCode";
import formatPhoneNumber from "../common/util/formatPhoneNumber";

export const registerService = async ({ phoneNumber }) => {
  try {
    const response = await findByConditions("User", { phoneNumber });
    if (response) {
      throw new Error("phoneNumber is exist");
    }
    const code = generateRandomNumber();
    const token = generateRandomString(20);
    const phoneNumberSend = formatPhoneNumber(phoneNumber);
    await setRedis({ key: phoneNumber, value: code });
    await setRedis({ key: `${phoneNumber}_token`, value: token });
    await sendSMS(
      `Ma xac nhan Ambio cua ban tai Ambio Smart la ${code}. Luu ý khong chia se ma nay cho bat ki ai`,
      phoneNumberSend
    );
    return { phoneNumber, code, token };
  } catch (error) {
    throw error;
  }
};

export const vetifyCodeService = async ({ phoneNumber, code, token }) => {
  try {
    const storeRandomNumber = await getRedis(phoneNumber);
    const tokenStoreRedis = await getRedis(`${phoneNumber}_token`);
    if (tokenStoreRedis !== token) {
      throw new Error("PhoneNumber is not register");
    }
    if (code !== Number(storeRandomNumber)) {
      throw new Error("Invalid phoneNumber or code");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * hash password
 * @param {*} passWord
 * @returns password was hash
 */
const hashPassword = (passWord) =>
  bcrypt.hashSync(passWord, bcrypt.genSaltSync(8));

/**
 * signUp account
 * @param {*} param0
 * @returns
 */
export const signUpService = async ({
  phoneNumber,
  passWord,
  clientID,
  deviceName,
  token,
  operatingSystem,
  deviceTokenCFM,
}) => {
  try {
    const tokenStoreRedis = await getRedis(`${phoneNumber}_token`);
    if (tokenStoreRedis !== token) {
      throw new Error("PhoneNumber is not register");
    }

    const { result: user, created } = await findOrCreate(
      "User",
      {
        phoneNumber,
      },
      {
        phoneNumber,
        deviceTokenCFM,
        passWord: hashPassword(passWord),
      }
    );
    if (created) {
      const userId = user.dataValues.id;
      const randomString = generateRandomString(20);
      const token = randomString.concat(userId);

      await createRecord("UserInfo", {
        userId,
        token,
        clientID,
        deviceName,
        isOriginDevice: true,
        operatingSystem,
        expirationTime: moment().add(7, "days"),
      });
      return {
        accessToken: token,
      };
    } else throw new Error("phoneNumber is exist");
  } catch (error) {
    throw error;
  }
};

export const loginService = async ({
  phoneNumber,
  passWord,
  clientID,
  deviceName,
  operatingSystem,
}) => {
  try {
    const user = await findByConditions("User", { phoneNumber });
    if (!user) {
      throw new Error("phoneNumber does not exist");
    }

    if (!bcrypt.compareSync(passWord, user.passWord)) {
      throw new Error("invalid phoneNumber or password");
    }
    const userId = user.id;
    const userInfo = await findByConditions("UserInfo", { userId, clientID });

    const randomString = generateRandomString(20);
    const token = randomString.concat(user.id);

    if (userInfo) {
      await updateRecord(
        "UserInfo",
        {
          expirationTime: moment().add(7, "days"),
        },
        {
          userId,
          clientID,
        }
      );
      return {
        accessToken: userInfo.token,
      };
    } else {
      await createRecord("UserInfo", {
        userId,
        token,
        clientID,
        deviceName,
        operatingSystem,
        isOriginDevice: false,
        expirationTime: moment().add(7, "days"),
      });
      const notification = {
        title: "Ambio notification414",
        body: "Có thiết bị mới đang đăng nhập tài khoản của bạn",
      };

      const fcmToken = [user.deviceTokenCFM];
      const notificationBody = {
        notification: notification,
        registration_ids: fcmToken,
      };

      try {
        const response = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            Authorization:
              "key=" +
              "AAAARTqzJsk:APA91bFOQm_5u_QE-p3loHH4jlT3QOcVANXRgiqDZNwBZSXu0dFbOLIVcBnCJ1fWn7R-OL4YndJ89v50_osRNT3gb7rAryIE5Oni8HikFtqpaKFyI9YqetlYDYQKbehIo5dAB7JwBNSG",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationBody),
        });

        if (response.ok) {
          console.log("Thành công");
        } else {
          console.log("Lỗi trong quá trình gửi thông báo");
        }
      } catch (err) {}
      return {
        accessToken: token,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordService = async ({ phoneNumber }) => {
  try {
    const response = await findByConditions("User", { phoneNumber });
    if (!response) {
      throw new Error("PhoneNumber does not exist");
    }

    const code = generateRandomNumber();
    const token = generateRandomString(20);
    const phoneNumberSend = formatPhoneNumber(phoneNumber);
    await setRedis({ key: phoneNumber, value: code });
    await setRedis({ key: `${phoneNumber}_token`, value: token });
    await sendSMS(
      `Ma xac nhan Ambio cua ban tai Ambio Smart la ${code}. Luu ý khong chia se ma nay cho bat ki ai`,
      phoneNumberSend
    );
    return { phoneNumber, code, token };
  } catch (error) {
    throw error;
  }
};

export const confirmNewPasswordService = async ({
  newPassWord,
  phoneNumber,
  clientID,
  token,
  deviceName,
  operatingSystem,
}) => {
  try {
    const tokenStoreRedis = await getRedis(`${phoneNumber}_token`);
    if (tokenStoreRedis !== token) {
      throw new Error("PhoneNumber is not verify");
    }
    const result = await db.sequelize.transaction(async (transaction) => {
      const user = await findByConditions(
        "User",
        {
          phoneNumber,
        },
        {
          passWord: hashPassword(newPassWord),
        },
        { transaction }
      );

      if (!user) {
        throw new Error("User not found");
      }

      const userId = user.id;
      const randomString = generateRandomString(20);
      const token = randomString.concat(user.id);

      await updateRecord(
        "User",
        {
          passWord: hashPassword(newPassWord),
        },
        {
          phoneNumber,
        },
        { transaction }
      );
      await destroyRecord(
        "UserInfo",
        {
          userId: user.id,
        },
        { transaction }
      );

      await createRecord(
        "UserInfo",
        {
          userId,
          token,
          clientID,
          deviceName,
          operatingSystem,
          isOriginDevice: true,
          expirationTime: moment().add(7, "days"),
        },
        { transaction }
      );

      return {
        accessToken: token,
      };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const verifyPhoneNymber = async ({ phoneNumber }) => {
  const response = await findByConditions("User", { phoneNumber });
  if (!response) {
    throw new Error("PhoneNumber does not exist");
  }
};
