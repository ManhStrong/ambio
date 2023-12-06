import db from "../models";
import moment from "moment";
import { Op } from "sequelize";

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
    const expirationTime = moment(userInfo.expirationTime);
    //lấy ngày hiện tại
    const currentDate = moment();
    //tính số ngày chênh lệch giữa ngày hết hạn và ngày hiện tại
    const daysDifference = expirationTime.diff(currentDate, "days");

    if (daysDifference < 2) {
      const newExpirationTime = moment(expirationTime).add(7, "days");

      // Cập nhật expirationTime trong cơ sở dữ liệu
      await db.UserInfo.update(
        {
          expirationTime: newExpirationTime,
        },
        {
          where: {
            userId: userInfo.userId,
            clientID: userInfo.clientID,
          },
        }
      );
    }
    const listDevices = await db.UserInfo.findAll({
      where: {
        userId: userInfo.userId,
      },
      attributes: [
        "id",
        "updatedAt",
        "clientID",
        "deviceName",
        "operatingSystem",
        "token",
      ],
    });

    const infoUserLogin = await db.User.findOne({
      where: {
        id: userInfo.userId,
      },
      attributes: ["userName", "phoneNumber"],
    });

    const currentTime = new Date();
    console.log(12333);

    // Bổ sung trường accessLastTime vào mỗi thiết bị
    const devicesWithAccessLastTime = listDevices.map((device) => {
      const accessLastTimeInMinutes = moment(currentTime).diff(
        device.updatedAt,
        "minutes"
      );

      const isThisDevice = device.token === userInfo.token ? true : false;

      // Nếu thời gian nhỏ hơn 60 phút, trả về số phút
      if (accessLastTimeInMinutes < 60) {
        return {
          id: device.id,
          clientID: device.clientID,
          deviceName: device.deviceName,
          operatingSystem: device.operatingSystem,
          accessLastTime: `${accessLastTimeInMinutes} phút trước`,
          isThisDevice,
        };
      }

      // Nếu có giờ mà lẻ, trả về 1 giờ
      if (accessLastTimeInMinutes < 24 * 60) {
        const hours = Math.floor(accessLastTimeInMinutes / 60);
        return {
          id: device.id,
          clientID: device.clientID,
          deviceName: device.deviceName,
          operatingSystem: device.operatingSystem,
          accessLastTime: `${hours} giờ trước`,
          isThisDevice,
        };
      }

      // Nếu thời gian vượt quá 24 giờ, trả về giá trị của trường updatedAt
      return {
        id: device.id,
        clientID: device.clientID,
        deviceName: device.deviceName,
        operatingSystem: device.operatingSystem,
        accessLastTime: device.updatedAt,
        isThisDevice,
      };
    });

    return {
      infoUserLogin: infoUserLogin,
      historyLogins: devicesWithAccessLastTime,
    };
  } catch (error) {
    throw error;
  }
};

export const logOutService = async (userInfo, input) => {
  try {
    const deviceDelete = input.filter((device) => {
      return device.isLogout === true;
    });

    const deviceLogin = userInfo.clientID;
    const clientIDsToDelete = deviceDelete.map((device) => device.clientID);

    // Kiểm tra xem tất cả các clientID cần xóa có tồn tại trong cơ sở dữ liệu không
    const existingClientIDs = await db.UserInfo.findAll({
      attributes: ["clientID"],
      where: {
        userId: userInfo.userId,
        clientID: {
          [Op.in]: clientIDsToDelete,
        },
      },
    });

    // So sánh danh sách clientID cần xóa với danh sách đã tồn tại
    const nonExistingClientIDs = clientIDsToDelete.filter(
      (clientID) =>
        !existingClientIDs.some((existing) => existing.clientID === clientID)
    );

    if (nonExistingClientIDs.length > 0) {
      // Nếu có ít nhất một clientID không tồn tại, trả về mã lỗi m004
      throw new Error("clientID is not found");
    }

    // Nếu tất cả clientID đều tồn tại, thực hiện xóa
    const result = await db.UserInfo.destroy({
      where: {
        userId: userInfo.userId,
        clientID: {
          [Op.in]: clientIDsToDelete,
        },
      },
    });
    if (clientIDsToDelete.includes(deviceLogin)) {
      return {
        message: "Redirect to login page",
      };
    }
  } catch (error) {
    throw error;
  }
};
