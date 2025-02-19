import logger from "../logs/logger.js";
import UserEnrolment from "../models/userenrolment.model.js";
import User from "../models/user.model.js";
import Branch from "../models/branch.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import { userEnrolmentValidation, userEnrolmentPatchValidation } from "../validations/userenrolment.validation.js";

async function findAll(req, res) {
  try {
    let allEnrolments = await UserEnrolment.findAll();
    res.send({ data: allEnrolments });
  } catch (e) {
    logger.error(`Error fetching all user enrolments: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
async function findOne(req, res) {
  try {
    let { id } = req.params;
    let enrolment = await UserEnrolment.findOne({ where: { id } });

    if (!enrolment) {
      return res.status(404).send({ error: "UserEnrolment Not Found" });
    }

    res.send({ data: enrolment });
  } catch (e) {
    logger.error(`Error fetching user enrolment with id ${req.params.id}: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function create(req, res) {
  try {
    const { userId, branchId, learningCenterId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    let userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(400).json({ error: "Invalid userId: User does not exist" });
    }
    if (!branchId && !learningCenterId) {
      return res.status(400).json({ error: "Either branchId or learningCenterId must be provided" });
    }
    if (branchId && learningCenterId) {
      return res.status(400).json({ error: "Only one of learningCenterId or branchId should be provided." });
    }
    if (branchId) {
      let branchExists = await Branch.findByPk(branchId);
      if (!branchExists) {
        return res.status(400).json({ error: "Invalid branchId: Branch does not exist" });
      }
    }
    if (learningCenterId) {
      let learningCenterExists = await LearningCenter.findByPk(learningCenterId);
      if (!learningCenterExists) {
        return res.status(400).json({ error: "Invalid learningCenterId: Learning Center does not exist" });
      }
    }

    const { error, value } = userEnrolmentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await UserEnrolment.create(value);
    res.status(201).send({ message: "User Enrolment Created Successfully" });
  } catch (e) {
    logger.error(`Error creating user enrolment: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;
    let enrolment = await UserEnrolment.findOne({ where: { id } });
    if (!enrolment) {
      return res.status(404).json({ error: "UserEnrolment Not Found" });
    }

    const { error, value } = userEnrolmentPatchValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await UserEnrolment.update(value, { where: { id } });
    res.send({ message: "User Enrolment Updated Successfully" });
  } catch (e) {
    logger.error(`Error updating user enrolment with id ${req.params.id}: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
async function remove(req, res) {
  try {
    let { id } = req.params;
    let enrolment = await UserEnrolment.findOne({ where: { id } });
    if (!enrolment) {
      return res.status(404).json({ error: "UserEnrolment Not Found" });
    }
    await UserEnrolment.destroy({ where: { id } });
    res.send({ message: "User Enrolment Deleted Successfully" });
  } catch (e) {
    logger.error(`Error deleting user enrolment with id ${req.params.id}: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
async function Search(req, res) {
  try {
    let { filter, sort, page = 1, limit = 10 } = req.query;
    let queryOptions = {};
    const offset = (page - 1) * limit;
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = offset;

    if (filter) {
      queryOptions.where = JSON.parse(filter);
    }

    if (sort) {
      queryOptions.order = [JSON.parse(sort)];
    }
    let allEnrolments = await UserEnrolment.findAll(queryOptions);
    const totalCount = await UserEnrolment.count({ where: queryOptions.where });
    const totalPages = Math.ceil(totalCount / limit);
    res.send({
      data: allEnrolments,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (e) {
    logger.error(`Error Searching user enrolments: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
export { findAll, Search, findOne, create, update, remove };
