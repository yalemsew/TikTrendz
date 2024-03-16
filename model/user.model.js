const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define(
  "user",
  {
    // Assuming your user has a name and email. Adjust as needed.
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true, // This prevents Sequelize from pluralizing the table name
  }
);

module.exports = User;
