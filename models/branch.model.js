import { DataTypes } from "sequelize";
import db from "../config/db.js";
import LearningCenter from "./learningCenter.model.js";
import Region from "./region.model.js";

const Branch = db.define(
  "branches",
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Region,
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    learningCenterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LearningCenter,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  },
  {
    timestamps: true,
  }
);

Region.hasOne(Branch, { foreignKey: "regionId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Branch.belongsTo(Region, { foreignKey: "regionId", onDelete: "CASCADE", onUpdate: "CASCADE" });

LearningCenter.hasMany(Branch, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Branch.belongsTo(LearningCenter, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Branch;

