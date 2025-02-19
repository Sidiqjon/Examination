import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./user.model.js";
import LearningCenter from "./learningCenter.model.js";
import Branch from "./branch.model.js";

const UserEnrolment = db.define(
  "userenrolments",
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
      allowNull: true, 
      references: {
        model: LearningCenter,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: Branch,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("waiting", "studying", "graduated"),
      allowNull: false,
      defaultValue: "studying",
   },
  },
  {
    timestamps: true,
    validate: {
      eitherLearningCenterOrBranch() {
        if (!this.learningCenterId && !this.branchId) {
          throw new Error("Either learningCenterId or branchId must be provided.");
        }
        if (this.learningCenterId && this.branchId) {
          throw new Error("Only one of learningCenterId or branchId should be provided.");
        }
      },
    },
  }
);

User.hasMany(UserEnrolment, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });
UserEnrolment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "CASCADE" });

LearningCenter.hasMany(UserEnrolment, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });
UserEnrolment.belongsTo(LearningCenter, { foreignKey: "learningCenterId", onDelete: "CASCADE", onUpdate: "CASCADE" });

Branch.hasMany(UserEnrolment, { foreignKey: "branchId", onDelete: "CASCADE", onUpdate: "CASCADE" });
UserEnrolment.belongsTo(Branch, { foreignKey: "branchId", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default UserEnrolment;
