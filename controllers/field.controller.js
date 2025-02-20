import Field from "../models/field.model.js";
import {
  FieldPatchValidation,
  FieldValidation,
} from "../validations/field.validation.js";
import Profession from "../models/profession.model.js";
import Subject from "../models/subject.model.js";
import { loggerError, loggerInfo } from "../logs/logger.js";
import { Op } from "sequelize";
import path from "path"
import fs from "fs"

const deleteOldImage = (imgPath) => { 
  if (imgPath) { 
    const fullPath = path.join("uploads", imgPath); 
    if (fs.existsSync(fullPath)) { 
      fs.unlinkSync(fullPath); 
    } 
  } 
};

async function findAll(req, res) {
  try {
    let all = await Field.findAll({
      include: [
        {
          model: Profession,
          attributes: ["id", "name", "img"],
        },
        {
          model: Subject,
          attributes: ["id", "name", "img"],
        },
      ],
    });

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Field-FindAll`
      );
      return res.status(404).json({ error: "No information available." });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindAll Field;`);

    res.status(200).send({ data: all });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Feild-FindAll`);
    res.status(500).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Field.findOne({
      where: { id },
      include: [
        {
          model: Profession,
          attributes: ["id", "name", "img"],
        },
        {
          model: Subject,
          attributes: ["id", "name", "img"],
        },
      ],
    });

    if (!one) {
      loggerError.error(
        `ERROR: Field Not Found;  Method: ${req.method};  Field-FindOne`
      );
      return res.status(404).json({ error: "Field Not Found" });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindOne Field;`);

    res.status(200).json({ data: one });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Feild-FindOne`);
    res.status(500).json({ error: e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = FieldValidation.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message });
    }
    if (value.professionId && value.subjectId) {
      loggerError.error(
        `ERROR: You cannot assign a value to subjectId and professionId at the same time!;  Method: ${req.method};  Field-Create`
      );
      return res.status(404).json({
        error:
          "You cannot assign a value to subjectId and professionId at the same time!",
      });
    }

    if (value.professionId) {
      let checkProfession = await Profession.findOne({
        where: { id: value.professionId },
      });

      if (!checkProfession) {
        loggerError.error(
          `ERROR: There is no such ID in the Profession table.;  Method: ${req.method};  Field-Create`
        );
        return res
          .status(404)
          .json({ error: "There is no such ID in the Profession table." });
      }
    }

    if (value.subjectId) {
      let chechSubject = await Subject.findOne({
        where: { id: value.subjectId },
      });

      if (!chechSubject) {
        loggerError.error(
          `ERROR: There is no such ID in the Subject table.;  Method: ${req.method};  Field-Create`
        );
        return res
          .status(404)
          .json({ error: "There is no such ID in the Subject table." });
      }
    }

    await Field.create(value);
    loggerInfo.info(`Method: ${req.method};  Saccessfully Create Field;`);

    res.status(201).json({ message: "Created  Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Feild-Create`);
    res.status(500).json({ error: e });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Field.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `Fields Not Found;  Method: ${req.method};  Field-FindAll`
      );
      return res.status(404).json({ error: "Fields Not Found" });
    }

    let { error, value } = FieldPatchValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Field-Update`
      );
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.img) { 
      deleteOldImage(check.img); 
    }

    if (value.professionId) {
      let checkProfession = await Profession.findOne({
        where: { id: value.professionId },
      });

      if (!checkProfession) {
        loggerError.error(
          `ERROR: There is no such ID in the Profession table.;  Method: ${req.method};  Field-Create`
        );
        return res
          .status(404)
          .json({ error: "There is no such ID in the Profession table." });
      }
      `  `;
    }

    if (value.subjectId) {
      let chechSubject = await Subject.findOne({
        where: { id: value.subjectId },
      });

      if (!chechSubject) {
        loggerError.error(
          `ERROR: There is no such ID in the Subject table.;  Method: ${req.method};  Field-Create`
        );
        return res
          .status(404)
          .json({ error: "There is no such ID in the Subject table." });
      }
    }

    if (value.professionId && value.subjectId) {
      loggerError.error(
        `ERROR: You cannot assign a value to subjectId and professionId at the same time!;  Method: ${req.method};  Field-Update`
      );
      return res.status(404).json({
        error:
          "You cannot assign a value to subjectId and professionId at the same time!",
      });
    }

    if (!value.subjectId || !value.professionId) {
      let checkF = await Field.findOne({ where: { id } });
      
      value.professionId = checkF.professionId
      value.subjectId = checkF.subjectId
    }

    await Field.update(value, { where: { id } });
    loggerInfo.info(`Method: ${req.method};  Saccessfully Update Field;`);

    res.status(201).json({ message: "Update Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Feild-Update`);
    res.status(500).json({ error: e });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Field.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Fields Not Found;  Method: ${req.method};  Field-Remove`
      );
      return res.status(404).json({ error: "Fields Not Found" });
    }

    deleteOldImage(check.img); 

    await Field.destroy({ where: { id } });
    loggerInfo.info(`Method: ${req.method};  Saccessfully Delete Field;`);

    res.status(200).json({ message: "Delete Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Feild-Delete`);
    res.status(500).json({ error: e });
  }
}

async function Search(req, res) {
  try {
    let { page, take } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;

      let categories = await Field.findAndCountAll({
        limit: take,
        offset: offset,
      });

      if (categories.rows.length == 0) {
        return res.status(404).json({error: "Pages Not Found"})
      }

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

    let results = await Field.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: [
        {
          model: Profession,
          attributes: ["id", "name", "img"],
        },
        {
          model: Subject,
          attributes: ["id", "name", "img"],
        },
      ],
    });

    loggerInfo.info(`Method: ${req.method};  Saccessfully Search Field;`);

    if (results == 0) {
      return res.status(404).json({error: "Fields Not Found"})
    }

    res.status(200).json({ data: results });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Feild-Search`);
    res.status(500).send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
