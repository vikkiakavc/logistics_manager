const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const inventoryCtrl = require("../controllers/inventoryCtrl");

router.post("/addItem", auth, inventoryCtrl.addItem);

module.exports = router;
