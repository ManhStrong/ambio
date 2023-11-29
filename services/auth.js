import db from "../models";
import generateRandomNumber from "../common/util/random";
import generateRandomString from "../common/util/randomString";
import bcrypt from "bcryptjs";
import moment from "moment";
const util = require("util");

const dotenv = require("dotenv");

dotenv.config();

const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

export const registerService = async ({ phoneNumber }) => {
  await client.connect();
  try {
    const response = await db.User.findOne({
      where: { phoneNumber },
    });
    if (response) {
      throw new Error("phoneNumber is exist");
    }
    const code = generateRandomNumber();
    await client.set(phoneNumber, code);
    return { phoneNumber, code };
  } catch (error) {
    throw error;
  } finally {
    await client.disconnect();
  }
};

export const vetifyCodeService = async ({ phoneNumber, code }) => {
  try {
    await client.connect();
    const storedRandomNumber = await client.get(phoneNumber);
    if (code === Number(storedRandomNumber)) {
    } else {
      // Giá trị không khớp
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
export const signUpService = async ({ phoneNumber, passWord }) => {
  try {
    const response = await db.User.findOrCreate({
      where: { phoneNumber },
      defaults: {
        phoneNumber,
        passWord: hashPassword(passWord),
      },
    });
    if (response[1] === true) {
      return {
        message: "signUp succesfully",
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
    const user = await db.User.findOne({
      where: { phoneNumber },
    });

    if (!user || !bcrypt.compareSync(passWord, user.passWord)) {
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
          token,
          expirationTime: moment().add(7, "days"),
        },
        {
          where: {
            userId: user.id,
            clientID,
          },
        }
      );
    } else {
      await db.UserInfo.create({
        userId: user.id,
        token,
        clientID,
        deviceName,
        operatingSystem,
        expirationTime: moment().add(7, "days"),
      });
    }
    return {
      accessToken: token,
    };
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
    await client.set(phoneNumber, code);
    return { phoneNumber, code };
  } catch (error) {
    throw error;
  } finally {
    await client.disconnect();
  }
};

export const confirmNewPasswordService = async ({
  newPassWord,
  phoneNumber,
}) => {
  try {
    const user = await db.User.findOne({
      where: { phoneNumber },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await db.User.update(
      {
        passWord: hashPassword(newPassWord),
      },
      {
        where: { phoneNumber },
      }
    );
    return {
      message: "change password successfully",
    };
  } catch (error) {
    throw error;
  }
};
