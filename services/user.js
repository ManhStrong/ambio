import db from "../models";

export const getUserById = async (userInfo) => {
  try {
    const user = await db.User.findOne({
      where: { id: userInfo.userId },
      attributes: ["id", "userName", "phoneNumber", "email"],
    });
    if (!user) {
      throw new Error("Not found User");
    }

    return { user };
  } catch (error) {
    throw error;
  }
};
export const getHistoryLoginService = async (userInfo) => {
  try {
    const historyLogins = await db.UserInfo.findAll({
      where: {
        userId: userInfo.userId,
      },
      attributes: [
        "id",
        "updatedAt",
        "clientID",
        "deviceName",
        "operatingSystem",
      ],
    });
    return {
      historyLogins,
    };
  } catch (error) {
    throw error;
  }
};
export const logOutService = async (userInfo) => {
  try {
    const token = userInfo.token;
    await db.UserInfo.destroy({
      where: { token: token },
    });
  } catch (error) {
    throw error;
  }
};
export const logoutOtherDeviceService = async (userInfo, { clientID }) => {
  try {
    const result = await db.UserInfo.destroy({
      where: { userId: userInfo.userId, clientID },
    });
  } catch (error) {
    throw error;
  }
};
