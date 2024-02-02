const db = require("../db/index");
const Users = db.users;

// register a new user
const addManager = async (req, res) => {
  try {
    // console.log("heyyy");
    const existingUsersCount = await Users.count();
    // console.log("AgainCount", existingUsersCount);
    if (existingUsersCount > 0) {
      const user = req.user;

      if (!user || user.getDataValue("role") !== "Manager") {
        return res
          .status(401)
          .send({ error: "Please authenticate as a manager!" });
      }
    }
    // console.log("just got here");
    const newUser = await Users.create(req.body);
    console.log(newUser);
    const token = await newUser.generateAuthToken();
    res
      .status(201)
      .send({ message: "user added successfully", newUser, token });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

// login user
const login = async (req, res) => {
  try {
    const user = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

//logout manager
const logout = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user);
    const updatedTokens = user.getDataValue("tokens").filter((token) => {
      return token.token !== req.token;
    });

    await Users.update({ tokens: updatedTokens }, { where: { id: user.id } });
    res.send();
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "Internal server error!" });
  }
};

// logoutAll manager
const logoutAll = async (req, res) => {
  try {
    const user = req.user;
    const updatedTokens = [];
    await Users.update({ tokens: updatedTokens }, { where: { id: user.id } });
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

// get manger profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    if (user.getDataValue("role") !== "Manager") {
      return res
        .status(401)
        .send({ error: "Please authenticate as a manager!" });
    }
    const userToDelete = await Users.findOne({ where: { id: req.params.id } });

    // Delete the user
    await userToDelete.destroy();

    res.status(204).send({ deletedUser: userToDelete });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addManager,
  login,
  logout,
  logoutAll,
  getProfile,
  deleteUser,
};
