import Comment from "../models/comment.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import User from "../models/user.model.js";
import {
  createCommentValidation,
  updateCommentValidation,
} from "../validations/comment.validation.js";
import { loggerError, loggerInfo } from "../logs/logger.js";
import { Op } from "sequelize";

async function findAll(req, res) {
  try {
    let allComments = await Comment.findAll({ include: { all: true } });
    if (!allComments.length) {
      return res.status(404).json({ error: "No comments found" });
    }
    res.status(200).send({ data: allComments });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function findOne(req, res) {
  try {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });

    if (!comment) {
      return res.status(404).send({ error: "Comment Not Found" });
    }

    res.status(200).send({ data: comment });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function create(req, res) {
  try {
    const { error, value } = createCommentValidation.validate(req.body);
    if (error) {
      return res
        .status(404)
        .json({ error: `Validation error: ${error.details[0].message}` });
    }

    const user = await User.findOne({ where: { id: value.userId } });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Invalid userId: No such User exists" });
    }

    const learningCenter = await LearningCenter.findOne({
      where: { id: value.learningCenterId },
    });
    if (!learningCenter) {
      return res.status(404).json({
        error: "Invalid learningCenterId: No such Learning Center exists",
      });
    }

    await Comment.create(value);
    res.status(201).send({ message: "Comment Sendet Successfully" });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: "Comment Not Found" });
    }

    const { error, value } = updateCommentValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: `Validation error: ${error.details[0].message}` });
    }

    await Comment.update(value, { where: { id } });

    res.status(200).send({ message: "Comment Updated Successfully" });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let comment = await Comment.findOne({ where: { id } });

    if (!comment) {
      return res.status(404).json({ error: "Comment Not Found" });
    }

    await Comment.destroy({ where: { id } });
    res.status(200).send({ message: "Comment Deleted Successfully" });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function Search(req, res) {
  try {
    let { page, take } = req.query;
    console.log(req.query);

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;

      let categories = await Comment.findAndCountAll({
        limit: take,
        offset: offset,
      });

      return res.status(200).json({
        totalItems: categories.count,
        totalPages: Math.ceil(categories.count / take),
        currentPage: page,
        data: categories.rows,
      });
    }

    let query = req.query;
    let conditions = {};
    let order = [];

    Object.keys(query).forEach((key) => {
      if (key !== "sortField" && key !== "sortOrder") {
        conditions[key] = {
          [Op.like]: `%${query[key]}%`,
        };
      }
    });

    if (query.sortField && query.sortOrder) {
      const sortField = query.sortField;
      const sortOrder =
        query.sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
      order.push([sortField, sortOrder]);
    }

    let results = await Comment.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: { all: true },
    });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Search Comment; data: ${results}`
    );
    res.status(200).json({ data: results });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Comment-Search`);
    res.status(500).send({ error: e.message });
  }
}

export { findAll, Search, findOne, create, update, remove };
