import { registerService } from "../services/auth";

const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const checkRegistration = async (req, res, next) => {
  try {
    await client.connect();
    const { phoneNumber } = req.body;

    const storedRandomNumber = await client.get(phoneNumber);
    if (!storedRandomNumber) {
      return BadRequestException(
        "PhoneNumber is not register",
        ErrorCode.INVALID_PARAM,
        res
      );
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    await client.disconnect();
  }
};

export default checkRegistration;
