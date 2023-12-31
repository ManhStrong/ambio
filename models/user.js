"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UserInfo, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      userName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      passWord: DataTypes.STRING,
      email: DataTypes.STRING,
      deviceTokenCFM: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    },
    {
      freezeTableName: true,
    }
  );
  return User;
};
