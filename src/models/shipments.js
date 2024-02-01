const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Shipments = sequelize.define("shipments", {
    orderId: {
      type: DataTypes.INTEGER,
      allownull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    destination: {
      type: DataTypes.STRING,
      allownull: false,
    },
    shipmentDate: {
      type: DataTypes.DATE,
      allownull: false,
    },
    expectedDelivery: {
      type: DataTypes.DATE,
      allownull: false,
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["In Transit", "Delayed", "Delivered"]],
          msg: "Please select the suitable status only",
        },
      },
    },
    currentLocation: {
      type: DataTypes.STRING,
    },
  });
  Shipments.beforeCreate(async (shipment, option) => {
    shipment.currentLocation = shipment.currentLocation.trim().toLowerCase();
    shipment.destination = shipment.destination.trim().toLowerCase();
  });
  return Shipments;
};
