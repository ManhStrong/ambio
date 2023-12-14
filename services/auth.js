import db from "../models";
import generateRandomNumber from "../common/util/random";
import generateRandomString from "../common/util/randomString";
import bcrypt from "bcryptjs";
import moment from "moment";
import { getRedis, setRedis } from "../lib/redis/redisService";
import sendSMS from "../lib/sms/senVerifyCode";
import formatPhoneNumber from "../common/util/formatPhoneNumber";
import userModel from "../lib/mysql/userModel";
import userInfoModel from "../lib/mysql/userInfo";

export const registerService = async ({ phoneNumber }) => {
  try {
    const response = await userModel.findByConditions({ phoneNumber });
    if (response) {
      throw new Error(
        "Số điện thoại đã được đăng kí. Vui lòng đăng kí với số điện thoại khác"
      );
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
    if (code !== Number(storeRandomNumber)) {
      throw new Error("code không hợp lệ hoặc đã hết hạn");
    }
    if (tokenStoreRedis !== token) {
      throw new Error("token không hợp lệ hoặc đã hết hạn");
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
      throw new Error("not implement register phoneNumber");
    }

    const { result: user, created } = await userModel.findOrCreate(
      { phoneNumber },
      { phoneNumber, deviceTokenCFM, passWord: hashPassword(passWord) }
    );
    if (created) {
      const userId = user.dataValues.id;
      const randomString = generateRandomString(20);
      const token = randomString.concat(userId);
      await userInfoModel.createRecord({
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
    } else
      throw new Error(
        "Số điện thoại đã được đăng kí. Vui lòng đăng kí với số điện thoại khác"
      );
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
    const user = await userModel.findByConditions({ phoneNumber });
    if (!user) {
      throw new Error("phoneNumber does not exist");
    }

    if (!bcrypt.compareSync(passWord, user.passWord)) {
      throw new Error("invalid phoneNumber or password");
    }
    const userId = user.id;
    const userInfo = await userInfoModel.findByConditions({ userId, clientID });

    const randomString = generateRandomString(20);
    const token = randomString.concat(user.id);

    if (userInfo) {
      await userInfoModel.updateRecord(
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
      await userInfoModel.createRecord({
        userId,
        token,
        clientID,
        deviceName,
        operatingSystem,
        isOriginDevice: false,
        expirationTime: moment().add(7, "days"),
      });
      const notification = {
        title: "Ambio notification",
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
    const response = await userModel.findByConditions({ phoneNumber });
    if (!response) {
      throw new Error(`Không tồn tại số điện thoại ${phoneNumber}`);
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
      const user = await userModel.findByConditions(
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

      await userModel.updateRecord(
        {
          passWord: hashPassword(newPassWord),
        },
        {
          phoneNumber,
        },
        { transaction }
      );
      await userInfoModel.destroyRecord(
        {
          userId: user.id,
        },
        { transaction }
      );

      await userInfoModel.createRecord(
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
  const response = await userModel.findByConditions({ phoneNumber });
  if (!response) {
    throw new Error(
      "Số điện thoại chưa được đăng kí, vui lòng đăng kí tài khoản mới"
    );
  }
};

export const getUserInfoService = async ({ token }) => {
  try {
    const userInfo = await userInfoModel.findByConditions({ token });
    if (!userInfo) {
      throw new Error("Invalid token");
    }
    const user = await userModel.findByConditions({ id: userInfo.userId });
    const expirationTime = userInfo.expirationTime;
    const currentTime = new Date();
    if (currentTime > expirationTime) {
      throw new Error("Token has expired");
    }
    return { userName: user.userName, phoneNumber: user.phoneNumber };
  } catch (error) {
    throw error;
  }
};
