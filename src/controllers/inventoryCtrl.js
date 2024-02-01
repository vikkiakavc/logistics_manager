const db = require("../db/index");
const Inventory = db.inventories;

const addItem = async (req, res) => {
  try {
    const user = req.user;
    if (user.getDataValue("role") !== "Manager") {
      return res
        .status(401)
        .send({ error: "Please authenticate as a manager!" });
    }
    const item = await Inventory.create(req.body);
    res.json(item);
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

module.exports = {
  addItem,
};
