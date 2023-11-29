import {
  registerService,
  signUpService,
  vetifyCodeService,
  loginService,
  forgotPasswordService,
  confirmNewPasswordService,
} from "../services/auth";
import {
  BadRequestException,
  InteralServerErrorException,
} from "../middlewares/handle-errors";
import ErrorCode from "../common/util/errorCode";

export const register = async (req, res, next) => {
  try {
    const phoneNumberRegex = /^(0[1-9]|84[1-9])([0-9]{8})$/;
    const { phoneNumber } = req.body;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return BadRequestException(
        "Invalid phoneNumber",
        ErrorCode.INVALID_PARAM,
        res
      );
    }

    const response = await registerService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "phoneNumber is exist") {
      return BadRequestException(
        "phoneNumber is exist",
        ErrorCode.DUPLICATE_VALUE,
        res
      );
    }
    return InteralServerErrorException();
  }
};

export const vetifyCode = async (req, res, next) => {
  try {
    const phoneNumberRegex = /^(0[1-9]|84[1-9])([0-9]{8})$/;
    const { phoneNumber, code } = req.body;
    if (!phoneNumberRegex.test(phoneNumber)) {
      BadRequestException("Invalid phoneNumber", ErrorCode.INVALID_PARAM, res);
    }

    const response = await vetifyCodeService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid phoneNumber or code"
    ) {
      return BadRequestException(
        "Invalid phoneNumber or code",
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
    const { phoneNumber, passWord } = req.body;
    if (!phoneNumber || !passWord) {
      return BadRequestException(
        "phoneNumber and password are not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }
    const response = await signUpService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === "phoneNumber is exist") {
      return BadRequestException(
        "phoneNumber is exist",
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

export const logIn = async (req, res, next) => {
  try {
    const { phoneNumber, passWord, clientID, deviceName, operatingSystem } =
      req.body;
    if (!phoneNumber || !passWord || !clientID) {
      return BadRequestException(
        "phoneNumber and password clientID are not empty",
        ErrorCode.REQUIRED_PARAM,
        res
      );
    }
    const response = await loginService(req.body);
    return res.status(200).json(response);
  } catch (error) {
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
    if (
      error instanceof Error &&
      error.message === "PhoneNumber does not exist"
    ) {
      return BadRequestException(
        "PhoneNumber does not exist",
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
    const { newPassWord, phoneNumber } = req.body;
    if (!newPassWord || !phoneNumber) {
      return BadRequestException(
        "password or phoneNumber is not empty",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    const response = await confirmNewPasswordService(req.body);
    return res.status(200).json(response);
  } catch (error) {
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