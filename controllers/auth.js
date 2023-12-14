import {
  registerService,
  signUpService,
  vetifyCodeService,
  loginService,
  forgotPasswordService,
  confirmNewPasswordService,
  verifyPhoneNymber,
  getUserInfoService,
} from "../services/auth";
import {
  BadRequestException,
  InteralServerErrorException,
  UnauthorizedException,
} from "../middlewares/handle-errors";
import ErrorCode from "../common/util/errorCode";
import { phoneNumberRegex } from "../common/util/regex";

export const register = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return BadRequestException(
        "Số điện thoại không hợp lệ",
        ErrorCode.INVALID_PARAM,
        res
      );
    }

    const response = await registerService(req.body);

    return res.status(200).json(response);
  } catch (error) {
    console.log(error, 99999);
    if (
      error instanceof Error &&
      error.message ===
        "Số điện thoại đã được đăng kí. Vui lòng đăng kí với số điện thoại khác"
    ) {
      return BadRequestException(
        "Số điện thoại đã được đăng kí. Vui lòng đăng kí với số điện thoại khác",
        ErrorCode.DUPLICATE_VALUE,
        res
      );
    }
    return InteralServerErrorException(
      "Internal server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};

export const vetifyCode = async (req, res, next) => {
  try {
    const { phoneNumber, code, token } = req.body;
    if (!phoneNumber || !code || !token) {
      return BadRequestException(
        "phoneNumber or code or token are not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }
    if (!phoneNumberRegex.test(phoneNumber)) {
      return BadRequestException(
        "Invalid phoneNumber",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    const response = await vetifyCodeService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "code không hợp lệ hoặc đã hết hạn"
    ) {
      return BadRequestException(
        "code không hợp lệ hoặc đã hết hạn",
        ErrorCode.INVALID_PARAM,
        res
      );
    }

    if (
      error instanceof Error &&
      error.message === "PhoneNumber is not register"
    ) {
      return BadRequestException(
        "PhoneNumber is not register",
        ErrorCode.NEED_REGISTER_PHONENUMBER,
        res
      );
    }

    if (
      error instanceof Error &&
      error.message === "PhoneNumber is not register"
    ) {
      return BadRequestException(
        "PhoneNumber is not register",
        ErrorCode.INVALID_PARAM,
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

export const signUp = async (req, res, next) => {
  try {
    const { phoneNumber, passWord, token, deviceTokenCFM } = req.body;
    if ((!phoneNumber || !passWord || !token, !deviceTokenCFM)) {
      return BadRequestException(
        "phoneNumber and password token are not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }
    const response = await signUpService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "not implement register phoneNumber"
    ) {
      return BadRequestException(
        "not implement register phoneNumber",
        ErrorCode.NEED_REGISTER_PHONENUMBER,
        res
      );
    }
    if (
      error instanceof Error &&
      error.message ===
        "Số điện thoại đã được đăng kí. Vui lòng đăng kí với số điện thoại khác"
    ) {
      return BadRequestException(
        "Số điện thoại đã được đăng kí. Vui lòng đăng kí với số điện thoại khác",
        ErrorCode.DUPLICATE_VALUE,
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

export const verifyPhoneNumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return BadRequestException(
        "Số điện thoại không hợp lệ",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    if (!phoneNumber) {
      return BadRequestException(
        "phoneNumber are not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }

    const response = await verifyPhoneNymber(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "Số điện thoại chưa được đăng kí, vui lòng đăng kí tài khoản mới"
    ) {
      return BadRequestException(
        "Số điện thoại chưa được đăng kí, vui lòng đăng kí tài khoản mới",
        ErrorCode.NOT_FOUND,
        res
      );
    }
  }
};

export const logIn = async (req, res, next) => {
  try {
    const { phoneNumber, passWord, clientID, deviceName, operatingSystem } =
      req.body;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return BadRequestException(
        "Invalid phoneNumber",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    if (
      !phoneNumber ||
      !passWord ||
      !clientID ||
      !deviceName ||
      !operatingSystem
    ) {
      return BadRequestException(
        "phoneNumber and password clientID, deviceName, operatingSystem are not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }
    const response = await loginService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error, 8888);
    if (
      error instanceof Error &&
      error.message === "phoneNumber does not exist"
    ) {
      console.log(123456);
      return BadRequestException(
        "phoneNumber does not exist",
        ErrorCode.NOT_FOUND,
        res
      );
    }
    if (
      error instanceof Error &&
      error.message === "invalid phoneNumber or password"
    ) {
      return BadRequestException(
        "invalid phoneNumber or password",
        ErrorCode.INVALID_PARAM,
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return BadRequestException(
        "Số điện thoại không hợp lệ",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    if (!phoneNumber) {
      return BadRequestException(
        "phoneNumber is not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }
    const response = await forgotPasswordService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    const { phoneNumber } = req.body;
    if (
      error instanceof Error &&
      error.message === `Không tồn tại số điện thoại ${phoneNumber}`
    ) {
      return BadRequestException(
        `Không tồn tại số điện thoại ${phoneNumber}`,
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

export const confirmNewPassword = async (req, res, next) => {
  try {
    const { newPassWord, phoneNumber, token } = req.body;
    if ((!newPassWord || !phoneNumber, !token)) {
      return BadRequestException(
        "password or phoneNumber or token is not empty",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    const response = await confirmNewPasswordService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PhoneNumber is not verify"
    ) {
      return BadRequestException(
        "PhoneNumber is not verify",
        ErrorCode.NEED_REGISTER_PHONENUMBER,
        res
      );
    }
    if (error instanceof Error && error.message === "User not found") {
      return BadRequestException("User not found", ErrorCode.NOT_FOUND, res);
    }

    return InteralServerErrorException(
      "Internal error server",
      ErrorCode.UNEXPECTED,
      res
    );
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    console.log(req.body, 6464664);
    const response = await getUserInfoService(req.body);

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid token") {
      return UnauthorizedException(
        "Invalid token",
        ErrorCode.UNAUTHORIZED,
        res
      );
    }

    if (error instanceof Error && error.message === "Token has expired") {
      return UnauthorizedException(
        "Token has expired",
        ErrorCode.UNAUTHORIZED,
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
