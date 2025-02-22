import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Subject = db.define(
  "subjects",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Subject;

