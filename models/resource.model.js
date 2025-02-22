import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./user.model.js";
import ResourceCategory from "./resourceCategory.model.js";

const Resource = db.define(
  "resources",
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
    media: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ResourceCategory,
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

User.hasMany(Resource, { foreignKey: "createdBy", onDelete: "CASCADE", onUpdate: "CASCADE" });
Resource.belongsTo(User, { foreignKey: "createdBy", onDelete: "CASCADE", onUpdate: "CASCADE" });

ResourceCategory.hasMany(Resource, { foreignKey: "categoryId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Resource.belongsTo(ResourceCategory, { foreignKey: "categoryId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Resource;


