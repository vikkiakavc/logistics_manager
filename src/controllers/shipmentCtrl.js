const db = require("../db/index");
const Shipment = db.shipments;

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
    const shipment = await Shipment.findOne({ where: { id: req.params.id } });
    updates.forEach((update) => (shipment[update] = req.body[update]));
    await shipment.save();
    res.status(200).send(shipment);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  addShipment,
  statusUpdate,
};
