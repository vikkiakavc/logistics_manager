const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
      allownull: false,
    },
    email: {
      type: DataTypes.STRING,
      allownull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 9) {
            throw new Error("set your password atleast 8 characters long!");
          }
        },
        isYourPasswordpassword(value) {
          if (value.toLowerCase() === "password") {
            throw new Error(
              `Your password must not be the word ${value}, yk it is easy to crack ;p`
            );
          }
        },
      },
    },
    gender: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        isIn: {
          args: [["Male", "Female"]],
          msg: "Please select from your gender from Male or Female only",
        },
      },
    },
    tokens: {
      type: DataTypes.JSON,
      defaultValue: [],
      allownull: false,
    },
    role: {
      type: DataTypes.STRING,
      allownull: false,
      validate: {
        isIn: {
          args: [["Staff", "Manager"]],
          msg: "Please select role as Staff or Manager only",
        },
      },
    },
    department: {
      type: DataTypes.STRING,
      allownull: false,
    },
  });

  // class methods (preHooks)
  // changing name and password values before creating
  Users.beforeCreate(async (user, options) => {
    user.name = user.username.trim();
    user.password = await bcrypt.hash(user.password.trim(), 8);
  });

  // changing values before updating
  Users.beforeUpdate(async (user, options) => {
    if (user.changed("name")) {
      user.name = user.name.trim();
    }

    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password.trim(), 8);
    }
  });

  // custom class method
  Users.findByCredentials = async function (email, password) {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      throw new Error("Unable to login!");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login!");
    }
    return user;
  };

  // Instance methods
  // generating auth token
  Users.prototype.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    const existingTokens = user.getDataValue("tokens");

    existingTokens.push({ token });

    await Users.update({ tokens: existingTokens }, { where: { id: user.id } });
    return token;
  };

  Users.prototype.toJSON = function () {
    const user = { ...this.get() };

    delete user.password;
    delete user.tokens;

    return user;
  };

  return Users;
};
