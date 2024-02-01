const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const reportCtrl = require("../controllers/reportCtrl");

router.get("/inventoryReport", auth, reportCtrl.inventoryReport);
router.get("/shipmentReport", auth, reportCtrl.shipmentReport);

module.exports = router;
