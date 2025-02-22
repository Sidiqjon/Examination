import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./user.model.js";
import LearningCenter from "./learningCenter.model.js";

const Comment = db.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    star: {
      type: DataTypes.DECIMAL(2,1), 
      allowNull: false,
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
  },
  {
    timestamps: true,
  }
);

User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });

LearningCenter.hasMany(Comment, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(LearningCenter, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Comment;

