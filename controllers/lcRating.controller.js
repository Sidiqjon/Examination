import LearningCenter from "../models/learningCenter.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { Op, Sequelize } from "sequelize";
import Branch from "../models/branch.model.js";
import Region from "../models/region.model.js";

async function getLCsByStars(req, res) {
  try {
    let { page = 1, take = 10, sort = "DESC" } = req.query;
    page = parseInt(page);
    take = parseInt(take);

    let offset = (page - 1) * take;

    let centers = await LearningCenter.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn("AVG", Sequelize.col("comments.star")),
            "averageStars",
          ],
        ],
      },
      include: [
        {
          model: Comment,
        },
        {
          model: Branch,
        },
        {
          model: Region,
        },
      ],
      group: ["learningCenter.id"],
      order: [[Sequelize.literal("averageStars"), sort]],
      limit: take,
      offset,
      subQuery: false,
    });

    res.status(200).json({ data: centers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLCsByComments(req, res) {
  try {
    let { page = 1, take = 10, sort = "DESC" } = req.query;
    page = parseInt(page);
    take = parseInt(take);

    let offset = (page - 1) * take;

    let centers = await LearningCenter.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("comments.id")),
            "totalComments",
          ],
        ],
      },
      include: [
        {
          model: Comment,
        },
        {
          model: Branch,
        },
        {
          model: Region,
        },
      ],
      group: ["learningCenter.id"],
      order: [[Sequelize.literal("totalComments"), sort]],
      limit: take,
      offset,
      subQuery: false,
    });

    res.status(200).json({ data: centers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLCsByLikes(req, res) {
  try {
    let { page = 1, take = 10, sort = "DESC" } = req.query;

    page = parseInt(page);
    take = parseInt(take);

    let offset = (page - 1) * take;

    let centers = await LearningCenter.findAll({
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("likes.id")),
            "totalLikes",
          ],
        ],
      },
      include: [
        {
          model: Like,
        },
        {
          model: Branch,
        },
        {
          model: Region,
        },
      ],
      group: ["learningCenter.id"],
      order: [[Sequelize.literal("totalLikes"), sort]],
      limit: take,
      offset,
      subQuery: false,
    });

    res.status(200).json({ data: centers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { getLCsByStars, getLCsByComments, getLCsByLikes };

