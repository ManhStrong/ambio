import {
  getUserById,
  getHistoryLoginService,
  logOutService,
  logoutOtherDeviceService,
} from "./../services/user";
import {
  InteralServerErrorException,
  BadRequestException,
} from "../middlewares/handle-errors";
import ErrorCode from "../common/util/errorCode";

export const getHistoryLogin = async (req, res, next) => {
  try {
    const response = await getHistoryLoginService(req.userInfo);
    return res.status(200).json(response);
  } catch (error) {
    return InteralServerErrorException(
      "Internal error server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};

export const logout = async (req, res, next) => {
  try {
    const input = req.body;

    if (
      !input.every((device) => device.clientID && device.clientID.trim() !== "")
    ) {
      return BadRequestException(
        "clientID can be not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }

    const response = await logOutService(req.userInfo, req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "clientID is not found") {
      return BadRequestException(
        "clientID is not found",
        ErrorCode.NOT_FOUND,
        res
      );
    }
    return InteralServerErrorException(
      "Internal error server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};
