import jwt from "jsonwebtoken";
import { UnauthorizedException } from "./handle-errors";
import db from "../models";

const dotenv = require("dotenv");

dotenv.config();
const vetifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  const accessToken = token?.split(" ")[1];

  if (!accessToken) {
    return UnauthorizedException("Require login", 401, res);
  }
  const userInfo = await db.UserInfo.findOne({
    where: { token: accessToken },
  });
  console.log(userInfo, "hihihi");
  if (!userInfo) {
    return UnauthorizedException("Invalid token", 401, res);
  }
  const expirationTime = userInfo.expirationTime;
  console.log(expirationTime, "hahahhah");
  const currentTime = new Date();
  if (currentTime > expirationTime) {
    return UnauthorizedException("Token has expired", 401, res);
  }

  //const accessToken = token.split(" ")[1];
  // req.token = accessToken;
  req.userInfo = userInfo;
  next();
  // jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
  //   if (err) return UnauthorizedException("Access token in valid", res);
  //   req.user = user;
  //   next();
  // });
};
export default vetifyToken;
