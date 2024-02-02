const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userCtrl");

router.post("/addUser", auth, userCtrl.addManager);
router.post("/login", userCtrl.login);
router.post("/logout", auth, userCtrl.logout);
router.post("/logoutAll", auth, userCtrl.logoutAll);
router.get("/getProfile", auth, userCtrl.getProfile);
router.delete("/deleteUser/:id", auth, userCtrl.deleteUser);

module.exports = router;
