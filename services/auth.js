import db from "../models";
import generateRandomNumber from "../common/util/random";
import generateRandomString from "../common/util/randomString";
import bcrypt from "bcryptjs";
import moment from "moment";

const dotenv = require("dotenv");

dotenv.config();

const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URI,
});

export const registerService = async ({ phoneNumber }) => {
  try {
    await client.connect();
    const response = await db.User.findOne({
      where: { phoneNumber },
    });
    if (response) {
      throw new Error("phoneNumber is exist");
    }
    const code = generateRandomNumber();
    const token = generateRandomString(20);
    await client.set(phoneNumber, code);
    await client.set(`${phoneNumber}_token`, token);
    return { phoneNumber, code, token };
  } catch (error) {
    throw error;
  } finally {
    await client.disconnect();
  }
};

export const vetifyCodeService = async ({ phoneNumber, code, token }) => {
  try {
    await client.connect();
    const storedRandomNumber = await client.get(phoneNumber);
    const tokenStoreRedis = await client.get(`${phoneNumber}_token`);
    if (tokenStoreRedis !== token) {
      throw new Error("PhoneNumber is not register");
    }
    if (code !== Number(storedRandomNumber)) {
      throw new Error("Invalid phoneNumber or code");
    }
  } catch (error) {
    throw error; // Re-throw error to propagate it to the caller
  } finally {
    await client.disconnect();
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
    await client.connect();

    const tokenStoreRedis = await client.get(`${phoneNumber}_token`);
    if (tokenStoreRedis !== token) {
      throw new Error("PhoneNumber is not register");
    }
    const response = await db.User.findOrCreate({
      where: { phoneNumber },
      defaults: {
        phoneNumber,
        deviceTokenCFM,
        passWord: hashPassword(passWord),
      },
    });
    const createUser = response[0];
    if (response[1] === true) {
      const userId = createUser.dataValues.id;
      const randomString = generateRandomString(20);
      const token = randomString.concat(userId);
      await db.UserInfo.create({
        userId: userId,
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
  } finally {
    await client.disconnect();
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
    const user = await db.User.findOne({
      where: { phoneNumber },
    });
    if (!user) {
      throw new Error("phoneNumber does not exist");
    }

    if (!bcrypt.compareSync(passWord, user.passWord)) {
      throw new Error("invalid phoneNumber or password");
    }

    const userInfo = await db.UserInfo.findOne({
      where: {
        userId: user.id,
        clientID,
      },
    });

    const randomString = generateRandomString(20);
    const token = randomString.concat(user.id);

    if (userInfo) {
      await db.UserInfo.update(
        {
          expirationTime: moment().add(7, "days"),
        },
        {
          where: {
            userId: user.id,
            clientID,
          },
        }
      );
      return {
        accessToken: userInfo.token,
      };
    } else {
      await db.UserInfo.create({
        userId: user.id,
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
      } catch (err) {
      }
      return {
        accessToken: token,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordService = async ({ phoneNumber }) => {
  await client.connect();
  try {
    const response = await db.User.findOne({
      where: { phoneNumber },
    });
    if (!response) {
      throw new Error("PhoneNumber does not exist");
    }

    const code = generateRandomNumber();
    const token = generateRandomString(20);

    await client.set(phoneNumber, code);
    await client.set(`${phoneNumber}_token`, token);
    return { phoneNumber, code, token };
  } catch (error) {
    throw error;
  } finally {
    await client.disconnect();
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
    await client.connect();
    const tokenStoreRedis = await client.get(`${phoneNumber}_token`);
    if (tokenStoreRedis !== token) {
      throw new Error("PhoneNumber is not verify");
    }
    const result = await db.sequelize.transaction(async (t) => {
      const user = await db.User.findOne({
        where: { phoneNumber },
        transaction: t,
      });

      if (!user) {
        throw new Error("User not found");
      }

      const randomString = generateRandomString(20);
      const token = randomString.concat(user.id);

      await db.User.update(
        {
          passWord: hashPassword(newPassWord),
        },
        {
          where: { phoneNumber },
          transaction: t,
        }
      );

      await db.UserInfo.destroy({
        where: { userId: user.id },
        transaction: t,
      });

      await db.UserInfo.create(
        {
          userId: user.id,
          token,
          clientID,
          deviceName,
          operatingSystem,
          isOriginDevice: true,
          expirationTime: moment().add(7, "days"),
        },
        {
          transaction: t,
        }
      );

      return {
        accessToken: token,
      };
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    await client.disconnect();
  }
};

export const verifyPhoneNymber = async ({ phoneNumber }) => {
  const response = await db.User.findOne({
    where: { phoneNumber },
  });
  if (!response) {
    throw new Error("PhoneNumber does not exist");
  }
};
