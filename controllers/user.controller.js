import User from "../models/user.model.js";
import UserEnrolment from "../models/userenrolment.model.js";
import Comment from "../models/comment.model.js";
import LearningCenter from "../models/learningCenter.model.js"
import Resource from "../models/resource.model.js" 
import Like from "../models/like.model.js"
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { 
  userPatchValid,   
  validatePhoneNumber, 
  validateName } from "../validations/user.validation.js";

const getAll = async (req, res) => {
    let userRole = req.user.role    
    console.log(userRole);
    
    if (userRole == "ADMIN") {
        getUsersForAdmin(req, res)
    }else {
        getAllCeo(req, res)
    }
};

const getUsersForAdmin = async (req, res) => {
  try {
    let { 
      page, 
      take = 10, 
      firstName, 
      lastName, 
      phoneNumber, 
      email, 
      role, 
      status, 
      sortBy = "createdAt", 
      sortOrder = "DESC" 
    } = req.query;

    page = page ? parseInt(page) : null;
    take = parseInt(take);
    const pagination = page ? { limit: take, offset: (page - 1) * take } : {};

    const where = {};
    if (firstName) where.firstName = { [Op.like]: `%${firstName}%` };
    if (lastName) where.lastName = { [Op.like]: `%${lastName}%` };
    if (phoneNumber) where.phoneNumber = { [Op.like]: `%${phoneNumber}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (role) where.role = role;
    if (status) where.status = status;

    const users = await User.findAndCountAll({
      where,
      include: {all: true},
      order: [[sortBy, sortOrder]],
      ...pagination,
    });

    if (!users.rows.length) return res.status(404).json({ message: "No users found" });

    return res.status(200).json({message: "All users for Admin:",
      total: users.count,
      page,
      take,
      data: users.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllCeo = async (req, res) => {
  try {
    let { page, take = 10, firstName, lastName, sortBy = "createdAt", sortOrder = "DESC" } = req.query;
    page = page ? parseInt(page) : null;
    take = parseInt(take);
    const pagination = page ? { limit: take, offset: (page - 1) * take } : {};

    const where = { role: "ceo" };
    if (firstName) where.firstName = { [Op.like]: `%${firstName}%` };
    if (lastName) where.lastName = { [Op.like]: `%${lastName}%` };

    if (page) {
      const ceos = await User.findAndCountAll({
        where,
        include: {all: true},
        order: [[sortBy, sortOrder]],
        ...pagination,
      });

      if (!ceos.rows.length) return res.status(404).json({ message: "No CEOs found!" });

      return res.status(200).json({
        total: ceos.count,
        page,
        take,
        data: ceos.rows,
      });
    } else {
      const ceos = await User.findAll({
        where,
        include: {all: true},
        order: [[sortBy, sortOrder]],
      });

      if (!ceos.length) return res.status(404).json({ message: "No CEOs found!" });

      return res.status(200).json({
        total: ceos.count,
        page,
        take,
        data: ceos,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: {all: true} });
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, img, status } = req.body;

    if (firstName){
        let checkfName = validateName(firstName)
        if (!checkfName) {
          return res.status(400).json({ message: "Name format is incorrect! Name must be at least 2 characters and contains only letters!" });
        }
    }

    if (lastName){
      let checklName = validateName(lastName)
      if (!checklName) {
        return res.status(400).json({ message: "Surname format is incorrect! Surname must be at least 2 characters and contains only letters!" });
      }
    }

    if (phoneNumber) {
      let checkPN = validatePhoneNumber(phoneNumber);
      if (!checkPN) {
        return res.status(400).json({ message: "Phone Number format is incorrect! Format: +998900000000" });
      }
    }

    let { error, value } = userPatchValid.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (img) {
      fs.unlink(path.join("uploads", user.img), (err) => {
        if (err) console.error("Error deleting image:", err.message);
      });
    }

    if (req.user.role !== "ADMIN" && req.user.id == id) {
      if (value.status) {
        return res.status(400).json({ message: "You cannot change your status!" });
      }
      await user.update(value);
    } else {
      await user.update(value);
    }
    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user.img) {
      fs.unlink(path.join("uploads", user.img), (err) => {
        if (err) console.error("Error deleting image:", err.message);
      });
    }

    if (id != req.user.id && req.user.role !== "ADMIN") {
      return res.status(400).json({ message: "You cannot delete another user!" });
    }
    
    const deleted = await user.destroy();

    if (!deleted) {
      return res.status(400).json({ message: "Failed to delete user" });
    }
    
    res.status(200).json({ message: "User deleted successfully!" });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAll, getOne, getAllCeo, update, remove };
