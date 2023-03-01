const express = require("express");
const MySQLStore = require("express-mysql-session");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "eu-cdbr-west-03.cleardb.net",
  username: "b23c8a045bfb66",
  password: "a2b3cd99",
  database: "heroku_e89598fb25b1a5e",
});

async function createTables() {
  try {
    const userTableExists = await User.describe();
    const clientTableExists = await Client.describe();
    const driverTableExists = await Driver.describe();
    const locationTableExists = await Location.describe();

    if (
      Object.keys(userTableExists).length !== 0 &&
      Object.keys(clientTableExists).length !== 0 &&
      Object.keys(driverTableExists).length !== 0 &&
      Object.keys(locationTableExists).length !== 0
    ) {
      console.log("Tables already exist");
      return;
    }
  } catch (error) {
    console.log("Error checking if tables exist", error);
  }

  await User.sync({ force: true });
  await Client.sync({ force: true });
  await Driver.sync({ force: true });
  await Location.sync({ force: true });
  console.log("Tables created successfully");
}
async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await createTables();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  f_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  l_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_num: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  user_type: {
    type: DataTypes.ENUM("client", "driver"),
    allowNull: false,
  },
});

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

const Driver = sequelize.define("Driver", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  car_make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  car_model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Location = sequelize.define("Location", {
  location_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location_month: {
    type: DataTypes.STRING(7),
    allowNull: false,
  },
});
main();
