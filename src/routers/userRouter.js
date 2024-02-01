const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userCtrl");

router.post("/addManager", auth, userCtrl.addManager);
router.post("/login", userCtrl.login);
router.post("/logout", auth, userCtrl.logout);
router.post("/logoutAll", auth, userCtrl.logoutAll);
router.delete("/deleteManager", auth, userCtrl.deleteManager);
router.get("/getProfile", auth, userCtrl.getProfile);

router.post("/addStaff", auth, userCtrl.addStaff);
router.delete("/deleteStaff/:id", auth, userCtrl.deleteStaff);

module.exports = router;
