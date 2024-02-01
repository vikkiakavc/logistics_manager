const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("orders", {
    userId: {
      type: DataTypes.INTEGER,
      allownull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    orderDate: {
      type: DataTypes.DATE,
      allownull: false,
    },
    totalValue: {
      type: DataTypes.DECIMAL(10, 2),
      allownull: false,
    },
  });
  return Orders;
};
