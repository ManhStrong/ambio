import {
  getUserById,
  getHistoryLoginService,
  logOutService,
  logoutOtherDeviceService,
} from "./../services/user";
import { InteralServerErrorException } from "../middlewares/handle-errors";
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

export const logOut = async (req, res, next) => {
  try {
    console.log(req.userInfo, "uuuuuuu");
    const response = await logOutService(req.userInfo);
    return res.status(200).json(response);
  } catch (error) {
    return InteralServerErrorException(
      "Internal error server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};

export const logoutOtherDevice = async (req, res, next) => {
  try {
    const response = await logoutOtherDeviceService(req.userInfo, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return InteralServerErrorException(
      "Internal error server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};
