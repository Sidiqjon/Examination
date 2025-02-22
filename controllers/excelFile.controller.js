import ExcelJS from "exceljs";
import User from "../models/user.model.js";
import UserEnrollment from "../models/userenrolment.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import Resource from "../models/resource.model.js";
import Comment from "../models/comment.model.js";
import Region from "../models/region.model.js";
import Branch from "../models/branch.model.js";
import Field from "../models/field.model.js";
import Like from "../models/like.model.js";
import LCField from "../models/lcfields.model.js"; 
import { Op } from "sequelize";

const exportUsersToExcel = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserEnrollment,
          include: ["learningCenter", "branch"],
          required: false,
        },
        { model: Comment, required: false },
        { model: Resource, required: false },
      ],
    });

    if (!users.length) return res.status(404).json({ message: "No users found" });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Last Name", key: "lastName", width: 20 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportLearningCentersToExcel = async (req, res) => {
  try {
    const learningCenters = await LearningCenter.findAll({
      include: [
        {
          model: Region,
          attributes: ["id", "name"],
          as: "region", 
          required: false,
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
          as: "user", 
          required: false,
        },
        {
          model: Branch,
          attributes: ["id"],
          as: "branches",
          required: false,
        },
        {
          model: Comment,
          attributes: ["id"],
          as: "comments",
          required: false,
        },
        {
          model: Like,
          attributes: ["id"],
          as: "likes",
          required: false,
        },
        {
          model: Field,
          attributes: ["id", "name"],
          as: "fields",
          required: false,
        },
      ],
    });

    if (!learningCenters.length)
      return res.status(404).json({ message: "No learning centers found" });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Learning Centers");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Address", key: "address", width: 30 },
      { header: "Region", key: "region", width: 20 },
      { header: "Created By", key: "createdBy", width: 35 },
      { header: "Branch Count", key: "branchCount", width: 15 },
      { header: "Total Comments", key: "totalComments", width: 15 },
      { header: "Total Likes", key: "totalLikes", width: 15 },
      { header: "Fields", key: "fields", width: 40 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    learningCenters.forEach((lc) => {
      worksheet.addRow({
        id: lc.id,
        name: lc.name,
        phoneNumber: lc.phoneNumber,
        address: lc.address,
        region: lc.region ? lc.region.name : "N/A",
        createdBy: lc.user
          ? `${lc.user.firstName} ${lc.user.lastName} (${lc.user.email})`
          : "N/A",
        branchCount: lc.branches ? lc.branches.length : 0,
        totalComments: lc.comments ? lc.comments.length : 0,
        totalLikes: lc.likes ? lc.likes.length : 0,
        fields: lc.fields && lc.fields.length > 0 
          ? lc.fields.map((f) => f.name).join(", ") 
          : "N/A",
        createdAt: lc.createdAt.toISOString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=learning_centers.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ error: error.message });
  }
};


export { exportUsersToExcel, exportLearningCentersToExcel };
