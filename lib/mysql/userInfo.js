import db from "../../models";

import BaseModel from "./baseModel";

class UserInfoModel extends BaseModel {
  constructor() {
    super("UserInfo");
  }
}

const userInfoModel = new UserInfoModel();
export default userInfoModel;
