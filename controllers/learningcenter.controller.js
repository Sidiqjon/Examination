import LearningCenter from "../models/learningCenter.model.js";
import {
  LearningCenterPatchValidation,
  LearningCenterValidation,
} from "../validations/learningcenter.validation.js";
import Region from "../models/region.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";
import LCField from "../models/lcfields.model.js";
import Field from "../models/field.model.js";
import { loggerError, loggerInfo } from "../logs/logger.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";

async function findAll(req, res) {
  try {
    let all = await LearningCenter.findAll({
      include: [
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: Field,
          attributes: ["id", "name", "professionId", "subjectId"],
        },
        {
          model: Like,
          attributes: ["id", "userId", "learningCenterId"],
        },
        {
          model: Comment,
          attributes: ["id", "comment","userId", "star"],
        },

      ],
    });

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  LearningCenter-FindAll`
      );
      return res.status(404).json({ error: "No information available." });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindAll LearningCenter;`
    );

    res.status(200).send({ data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-FindAll`
    );

    res.status(500).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await LearningCenter.findOne({
      where: { id },
      include: [
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: Field,
          attributes: ["id", "name", "professionId", "subjectId"],
        },
        {
          model: Like,
          attributes: ["id", "userId", "learningCenterId"],
        },
        {
          model: Comment,
          attributes: ["id", "comment","userId", "star"],
        },
      ],
    });

    if (!one) {
      loggerError.error(
        `ERROR: Region Not Found;  Method: ${req.method};  LearningCenter-FindOne`
      );
      return res.status(404).json({ error: "Region Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindOne LearningCenter;`
    );

    res.status(200).json({ data: one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-FindOne`
    );

    res.status(500).json({ error: e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = LearningCenterValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  LearningCenter-Create`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    let LcField = value.lcfield || [];

    for (let e of LcField) {
      let check = await Field.findOne({ where: { id: e } });

      if (!check) {
        loggerError.error(
          `There are no such IDs in the Field table!;  Method: ${req.method};  LearningCenter-Create`
        );
        return res
          .status(401)
          .json({ error: "There are no such IDs in the Field table!" });
      }
    }

    let newLc = await LearningCenter.create(value);

    LcField.forEach(async (e) => {
      await LCField.create({ fieldId: e, learningCenterId: newLc.id });
    });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Create LearningCenter;`
    );
    res.status(201).json({ message: "Created Succesfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-Create`
    );

    res.status(401).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await LearningCenter.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Learning Center Not Found;  Method: ${req.method};  LearningCenter-Update`
      );
      return res.status(404).json({ error: "Learning Center Not Found" });
    }

    let { error, value } = LearningCenterPatchValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  LearningCenter-Update`
      );
      return res.status(400).json({ error: error.details[0].message });
    }

    await LearningCenter.update(value, { where: { id } });
    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Update LearningCenter;`
    );
    res.status(200).json({ message: "Update Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-Update`
    );

    res.status(500).json({ error: e });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await LearningCenter.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Learning Center Not Found;  Method: ${req.method};  LearningCenter-Delete`
      );
      return res.status(401).json({ error: "Learning Center Not Found" });
    }

    await LearningCenter.destroy({ where: { id } });
    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete LearningCenter;`
    );
    res.status(201).json({ message: "Delete Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-Delete`
    );
    res.status(401).json({ error: e });
  }
}

async function Search(req, res) {
  try {
    console.log("conditions");
    let { page, take } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;

      let categories = await LearningCenter.findAndCountAll({
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

    let results = await LearningCenter.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: [
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: Field,
          attributes: ["id", "name", "professionId", "subjectId"],
        },
        {
          model: Like,
          attributes: ["id", "userId", "learningCenterId"],
        },
        {
          model: Comment,
          attributes: ["id", "comment","userId", "star"],
        },
      ],
    });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Search LearningCenter; data: ${results}`
    );
    res.status(201).json({ data: results });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-Search`
    );
    res.send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
