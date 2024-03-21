const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

class User extends Model {}

User.init(
  {
    // 模型属性
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("it", "operation", "user"),
      defaultValue: "user",
    },
  },
  {
    sequelize,
    modelName: "user",
    freezeTableName: true,
  }
);

module.exports = User;
