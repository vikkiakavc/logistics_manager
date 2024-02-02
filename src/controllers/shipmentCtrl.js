const db = require("../db/index");
const Shipment = db.shipments;
const Orders = db.orders;

// Endpoint to create an order
const createOrder = async (req, res) => {
  try {
    const user = req.user;
    if (user.getDataValue("role") !== "Manager") {
      return res
        .status(401)
        .send({ error: "Please authenticate as a manager!" });
    }
    const { order_date, totalValue } = req.body;
    console.log(order_date);
    console.log(totalValue);
    let orderDate = new Date(order_date);

    // Create the order
    const newOrder = await Orders.create({
      userId: user.id,
      orderDate,
      totalValue,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addShipment = async (req, res) => {
  try {
    const { orderId, destination, expectedDelivery } = req.body;
    const shipmentDate = new Date();
    const shipment = await Shipment.create({
      orderId,
      destination,
      shipmentDate,
      expectedDelivery,
    });
    res.send({
      message: "Shipment created successfully",
      shipment,
      trackingId: shipment.id,
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

const statusUpdate = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["status", "currentLocation"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }
    // console.log("------------------");
    // console.log(req.body);
    const shipment = await Shipment.findOne({ where: { id: req.params.id } });
    // console.log(shipment);
    updates.forEach((update) => (shipment[update] = req.body[update]));
    await shipment.save();
    res.status(200).send(shipment);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  addShipment,
  statusUpdate,
};
