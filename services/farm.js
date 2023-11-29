import db from "../models";
import moment from "moment";

export const getFarmByUserID = async (userInfo) => {
  try {
    const farms = await db.Farm.findAll({
      where: { userID: userInfo.userId },
    });

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
    return { farms };
  } catch (error) {
    throw error;
  }
};
