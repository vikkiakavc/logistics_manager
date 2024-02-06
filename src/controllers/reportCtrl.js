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
  calculateGeographicalDistribution,
} = require("../utils/shipmentRepostFns");

const inventoryReport = async (req, res) => {
  try {
    const user = req.user;
    if (user.getDataValue("role") !== "Manager") {
      return res
        .status(401)
        .send({ error: "Please authenticate as a manager!" });
    }
    const { supplier, sortBy, sort_order } = req.query;

    // Applying filters
    let filters = {};

    if (supplier) {
      if (Array.isArray(supplier) && supplier.length > 0) {
        filters.supplier = {
          [Op.in]: supplier,
        };
      } else {
        filters.supplier = supplier;
      }
    }

    // Applying sort by name, quantity, and price

    let sortFields = [];
    if (sortBy) {
      if (Array.isArray(sortBy) && sortBy.length > 0) {
        sortBy.forEach((item) => {
          sortFields.push([item, sort_order || "ASC"]);
        });
      } else {
        sortFields.push([sortBy, sort_order || "ASC"]);
      }
    }

    const inventoryItems = await Inventory.findAll({
      where: filters,
      order: sortFields,
    });
    // console.log(inventoryItems);

    const totalItems = inventoryItems.length;
    // console.log(totalItems);
    const totalValue = calculateTotalValue(inventoryItems);
    // console.log(totalValue);
    const averageCost = calculateAverageCost(inventoryItems);
    // console.log(averageCost);

    // Categorize items as 'Low Stock' and 'Out of Stock'
    const { lowStockItems, outOfStockItems } = categorizeItems(inventoryItems);
    // console.log(lowStockItems);
    // console.log(outOfStockItems);

    // Calculate turnover rates
    const turnoverRates = calculateTurnoverRates(inventoryItems);
    // console.log(turnoverRates);

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
        totalValue: totalValue.toFixed(2),
        averageCost: averageCost.toFixed(2),
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

    const { start_Date, end_Date, filterByStatus } = req.query;
    const startDate = new Date(start_Date);
    const endDate = new Date(end_Date);

    let filters = {};

    // Applying filters for shipmentDate
    if (startDate || endDate) {
      filters.shipmentDate = {};
      if (startDate) {
        filters.shipmentDate[Op.gte] = startDate;
      }
      if (endDate) {
        filters.shipmentDate[Op.lte] = endDate;
      }
    }

    // Applying filter by status
    if (filterByStatus) {
      filters.status = filterByStatus;
    }
    // console.log(filters);
    const shipments = await Shipment.findAll({ where: filters });

    // console.log(shipments);
    const statusAnalysis = getStatusAnalysis(shipments);
    const deliveryAnalysis = getDeliveryAnalysis(shipments);
    const geographicalDistribution =
      calculateGeographicalDistribution(shipments);

    const response = {
      shipmentDetails: shipments.map((item) => ({
        shipmentId: item.id,
        orderId: item.orderId,
        destination: item.destination,
        shipmentDate: item.shipmentDate,
        expectedDelivery: item.expectedDelivery,
        status: item.status,
        currentLocation: item.currentLocation,
      })),
      statusAnalysis,
      deliveryAnalysis,
      geographicalDistribution,
    };
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

module.exports = {
  inventoryReport,
  shipmentReport,
};
