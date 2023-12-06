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

export const getUserCurrent = async (req, res, next) => {
  try {
    const response = await getUserById(req.userInfo);
    console.log(6666, response);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Not found User") {
      return BadRequestException("Not found User", ErrorCode.NOT_FOUND, res);
    }
    return InteralServerErrorException(
      "Internal error server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};

export const getHistoryLogin = async (req, res, next) => {
  try {
    console.log(88888, req.userInfo);
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
    console.log(66666, req.userInfo);
    const input = req.body;
    console.log(input, 66666);

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
