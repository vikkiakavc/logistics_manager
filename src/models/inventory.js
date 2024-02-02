const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define("inventory", {
    name: {
      type: DataTypes.STRING,
      allownull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allownull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allownull: false,
      validate: {
        min: 0,
        isDecimal: true,
      },
    },
    supplier: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });
  Inventory.beforeCreate(async (item, option) => {
    item.supplier = item.supplier.trim();
  });
  return Inventory;
};
