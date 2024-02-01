const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("../models/users")(sequelize, DataTypes);
db.orders = require("../models/orders")(sequelize, DataTypes);
db.inventories = require("../models/inventory")(sequelize, DataTypes);
db.reports = require("../models/reports")(sequelize, DataTypes);
db.shipments = require("../models/shipments")(sequelize, DataTypes);

// one to many between users and orders
db.users.hasMany(db.orders, { foreignKey: "userId" });
db.orders.belongsTo(db.users, { foreignKey: "userId" });

// one to many between orders and shipments
db.orders.hasMany(db.shipments, { foreignKey: "orderId" });
db.shipments.belongsTo(db.orders, { foreignKey: "orderId" });

// one to many between users and reports
db.users.hasMany(db.reports, { foreignKey: "generatedBy" });
db.reports.belongsTo(db.users, { foreignKey: "generatedBy" });

db.sequelize.sync({ force: true }).then(() => {
  console.log(" yes re-sync");
});

module.exports = db;
