const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define("reports", {
    reportType: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        isIn: {
          args: [["Inventory", "Shipment"]],
          msg: "Please select the suitable report type only",
        },
      },
    },
    generatedBy: {
      type: DataTypes.INTEGER,
      allownull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    generatedDate: {
      type: DataTypes.DATE,
      allownull: false,
    },
    reportData: {
      type: DataTypes.JSON,
      defaultValue: {},
      allownull: false,
    },
  });
  return Reports;
};
