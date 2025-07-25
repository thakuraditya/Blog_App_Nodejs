import { Sequelize, DataTypes } from "sequelize";
import commentModel from "./model/commentModel.js";
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

const Comment = commentModel(sequelize, DataTypes);

const models = {
  Comment,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

await sequelize.sync();
export { sequelize, models };
