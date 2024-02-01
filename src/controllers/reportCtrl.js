const db = require("../db/index");
const Inventory = db.inventories;
const Shipment = db.shipments;
const { Op } = require("sequelize");
const {
  calculateTotalValue,
  calculateAverageCost,
  categorizeItems,
  calculateTurnoverRates,
} = require("../utils/inventoryReportFns");

const {
  getStatusAnalysis,
  getDeliveryAnalysis,
} = require("../utils/shipmentRepostFns");

const inventoryReport = async (req, res) => {
  try {
    const user = req.user;
    if (user.getDataValue("role") !== "Manager") {
      return res
        .status(401)
        .send({ error: "Please authenticate as a manager!" });
    }
    const { category, supplier, name, quantity, price, sortOrder } = req.body;

    // applying filters

    let filters = {};
    // categories as a multiselct filter
    if (category && Array.isArray(category) && category.length > 0) {
      filters.category = {
        [Op.in]: category,
      };
    }
    // supplier as a multiselect filter
    if (supplier && Array.isArray(supplier) && supplier.length > 0) {
      filters.supplier = {
        [Op.in]: supplier,
      };
    }

    // applying sortby name, quantity and price
    let sortFields = [];
    if (name) {
      sortFields.push(name);
    }
    if (quantity) {
      sortFields.push(quantity);
    }
    if (price) {
      sortFields.push(price);
    }
    // applying the sort order
    sortOrder = sortOrder.toUpperCase();

    const inventoryItems = await Inventory.findAll({
      where: filters,
      order: sortFields.map((field) => [field, sortOrder]),
    });

    const totalItems = inventoryItems.length;
    const totalValue = calculateTotalValue(inventoryItems);
    const averageCost = calculateAverageCost(inventoryItems);

    // Categorize items as 'Low Stock' and 'Out of Stock'
    const { lowStockItems, outOfStockItems } = categorizeItems(inventoryItems);

    // Calculate turnover rates
    const turnoverRates = calculateTurnoverRates(inventoryItems);

    const response = {
      inventoryDetails: inventoryItems.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        price: item.price,
        supplier: item.supplier,
      })),
      inventorySummary: {
        totalItems,
        totalValue,
        averageCost,
        lowStockItems,
        outOfStockItems,
        turnoverRates,
      },
    };

    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

const shipmentReport = async (req, res) => {
  try {
    const user = req.user;
    if (user.getDataValue("role") !== "Manager") {
      return res
        .status(401)
        .send({ error: "Please authenticate as a manager!" });
    }

    const { startDate, endDate, filterByStatus } = req.body;

    let filters = {};
    // applying filters for shipmentDate
    if (startDate && endDate) {
      filters.shipmentDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      filters.shipmentDate = {
        [Op.gte]: [startDate],
      };
    } else if (endDate) {
      filters.shipmentDate = {
        [Op.lte]: [endDate],
      };
    }

    if (filterByStatus) {
      filters.status = filterByStatus;
    }

    const shipments = await Shipment.findAll({ where: filters });

    const statusAnalysis = getStatusAnalysis(shipments);
    const deliveryAnalysis = getDeliveryAnalysis(shipments);
    // const geographicalDistribution =
    //   calculateGeographicalDistribution(shipments);

    res.status(200).send({
      shipmentDetails,
      statusAnalysis,
      deliveryAnalysis,
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

module.exports = {
  inventoryReport,
  shipmentReport,
};
