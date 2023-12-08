// const auth = require("./auth");
import register from "./register";
import vetifyCode from "./vetifyCode";
import signUp from "./signup";
import verifyPhoneNumber from "./verifyPhoneNumber";
import login from "./login";
import user from "./user";
import farm from "./farm";
import forgotPassword from "./forgotPassword";
import confirmNewPassword from "./confirmNewPassword";
import historyLogin from "./historyLogin";
import logout from "./logout";
const initRoutes = (app) => {
  app.use("/api/v1/users", register);
  app.use("/api/v1/users", vetifyCode);
  app.use("/api/v1/users", signUp);
  app.use("/api/v1/users", verifyPhoneNumber);
  app.use("/api/v1/users", login);
  app.use("/api/v1/users", forgotPassword);
  app.use("/api/v1/users", confirmNewPassword);
  app.use("/api/v1/users", user);
  app.use("/api/v1/farms", farm);
  app.use("/api/v1/users", historyLogin);
  app.use("/api/v1/users", logout);
  return app.use("/", (req, res) => {
    return res.send("SERVER OWN");
  });
};
module.exports = initRoutes;
