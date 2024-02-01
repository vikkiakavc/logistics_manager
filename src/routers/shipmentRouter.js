const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const shipmentCtrl = require("../controllers/shipmentCtrl");

router.post("/addShipment", auth, shipmentCtrl.addShipment);
router.patch("/updateShipment", auth, shipmentCtrl.statusUpdate);

module.exports = router;
