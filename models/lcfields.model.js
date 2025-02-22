import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Field from "./field.model.js";
import LearningCenter from "./learningCenter.model.js";

const LCfield = db.define(
  "lcfields",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Field,
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
    },
  },
  {
    timestamps: true,
  }
);

Field.belongsToMany(LearningCenter, { through: LCfield, foreignKey: "fieldId", onDelete: "CASCADE", onUpdate: "CASCADE", });

LearningCenter.belongsToMany(Field, { through: LCfield, foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE", });

export default LCfield;
