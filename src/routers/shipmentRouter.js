const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const shipmentCtrl = require("../controllers/shipmentCtrl");

router.post("/createOrder", auth, shipmentCtrl.createOrder);
router.post("/addShipment", auth, shipmentCtrl.addShipment);
router.patch("/updateShipment/:id", auth, shipmentCtrl.statusUpdate);

module.exports = router;
