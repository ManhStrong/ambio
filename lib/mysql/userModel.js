import db from "../../models";

import BaseModel from "./baseModel";

class UserModel extends BaseModel {
  constructor() {
    super("User");
  }
}

const userModel = new UserModel();
export default userModel;
