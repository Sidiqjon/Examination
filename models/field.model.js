import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Profession from "./profession.model.js"
import Subject from "./subject.model.js"

const Field = db.define(
  "fields",
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
    professionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Profession,
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Subject,
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    validate: {
      atLeastOneField() {
        if (!this.professionId && !this.subjectId) {
          throw new Error("Either professionId or subjectId must be provided.");
        }
        if (this.professionId && this.subjectId) {
          throw new Error("Only one of professionId or subjectId should be provided.");
        }
      },
    },
  }
);

Profession.hasMany(Field, { foreignKey: "professionId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Field.belongsTo(Profession, { foreignKey: "professionId", onDelete: "CASCADE", onUpdate: "CASCADE" });

Subject.hasMany(Field, { foreignKey: "subjectId", onDelete: "CASCADE", onUpdate: "CASCADE" });
Field.belongsTo(Subject, { foreignKey: "subjectId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Field;
