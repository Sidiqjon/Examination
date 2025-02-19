import ExcelJS from "exceljs";
import User from "../models/user.model.js";
import UserEnrollment from "../models/userenrolment.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import Resource from "../models/resource.model.js";
import Comment from "../models/comment.model.js";
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

export { exportUsersToExcel };
