import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./user.model.js";
import LearningCenter from "./learningCenter.model.js";

const Like = db.define(
  "likes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
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

User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });

LearningCenter.hasMany(Like, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Like.belongsTo(LearningCenter, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Like;

