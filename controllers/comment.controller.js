import logger from "../logs/logger.js";
import Comment from "../models/comment.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import User from "../models/user.model.js"; 
import { createCommentValidation ,updateCommentValidation} from "../validations/comment.validation.js";

async function findAll(req, res) {
  try {
    let allComments = await Comment.findAll();
    if (!allComments.length) {
      return res.status(404).json({ error: "No comments found" });
    }
    res.send({ data: allComments });
  } catch (e) {
    logger.error(`Error fetching comments: ${e.message}`);
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

    res.send({ data: comment });
  } catch (e) {
    logger.error(`Error fetching comment with id ${req.params.id}: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function create(req, res) {
  try {
    const { error, value } = createCommentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: `Validation error: ${error.details[0].message}` });
    }

    const user = await User.findOne({ where: { id: value.userId } });
    if (!user) {
      return res.status(400).json({ error: "Invalid userId: No such User exists" });
    }

    const learningCenter = await LearningCenter.findOne({ where: { id: value.learningCenterId } });
    if (!learningCenter) {
      return res.status(400).json({ error: "Invalid learningCenterId: No such Learning Center exists" });
    }

    const existingComment = await Comment.findOne({ 
      where: { userId: value.userId, learningCenterId: value.learningCenterId } 
    });

    if (existingComment) {
      return res.status(400).json({ error: "This comment already exists for the given user and learning center" });
    }

    await Comment.create(value);
    res.status(201).send({ message: "Comment Created Successfully" });

  } catch (e) {
    logger.error(`Error creating comment: ${e.message}`);
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
      return res.status(400).json({ error: `Validation error: ${error.details[0].message}` });
    }

    await Comment.update(value, { where: { id } });

    res.send({ message: "Comment Updated Successfully" });
  } catch (e) {
    logger.error(`Error updating comment with id ${req.params.id}: ${e.message}`);
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
    res.send({ message: "Comment Deleted Successfully" }); 
  } catch (e) {
    logger.error(`Error deleting comment with id ${req.params.id}: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" }); 
  }
}

async function Search(req, res) {
  try {
    const { sortBy, order = "ASC", star, userId, page = 1, limit = 10 } = req.query;

    const whereConditions = {};
    if (star) whereConditions.star = star;
    if (userId) whereConditions.userId = userId;

    let orderConditions = sortBy ? [[sortBy, order]] : [];

    const offset = (page - 1) * limit;
    let { rows: allComments, count } = await Comment.findAndCountAll({
      where: whereConditions,
      order: orderConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (!allComments.length) {
      return res.status(404).json({ error: "No comments found" });
    }

    res.send({
      data: allComments,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (e) {
    logger.error(`Error Searching comments: ${e.message}`);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

export { findAll, Search, findOne, create, update, remove };
