const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();
app.use(express.json());

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "sql.freedb.tech",
  username: "freedb_anas_dtk",
  password: "NsGxN6&DPtCwzb5",
  database: "freedb_adroad",
});


async function createTables() {
  try {
    const userTableExists = await Users.describe();
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

  await Users.sync({ force: true });
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

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  f_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  l_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_num: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  user_type: {
    type: DataTypes.ENUM("client", "driver"),
    allowNull: true,
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
    allowNull: true,
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
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
    allowNull: true,
  },
  car_model: {
    type: DataTypes.STRING,
    allowNull: true,
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
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  location_month: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
});
main();

module.exports = {Users,Driver,Location};