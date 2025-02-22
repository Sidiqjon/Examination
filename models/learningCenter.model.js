import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Region from "./region.model.js";
import User from "./user.model.js"

const LearningCenter = db.define(
  "learningCenter",
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
      unique: true
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
    branchNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

Region.hasMany(LearningCenter, { foreignKey: "regionId", onDelete: "CASCADE", onUpdate: "CASCADE" });
LearningCenter.belongsTo(Region, { foreignKey: "regionId", onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasMany(LearningCenter, { foreignKey: "createdBy", onDelete: "CASCADE", onUpdate: "CASCADE" })
LearningCenter.belongsTo(User, { foreignKey: "createdBy", onDelete: "CASCADE", onUpdate: "CASCADE" })

export default LearningCenter;

