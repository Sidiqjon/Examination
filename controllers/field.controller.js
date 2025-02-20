import Field from "../models/field.model.js";
import { FieldPatchValidation, FieldValidation } from "../validations/field.validation.js";
import Profession from "../models/profession.model.js";
import Subject from "../models/subject.model.js";
import { Op } from "sequelize";
import { loggerError, loggerInfo } from "../logs/logger.js";
import fs from "fs";
import path from "path";

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
    let all = await Field.findAll({ include: [Profession, Subject] });

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Field-FindAll`
      );
      return res.status(404).json({ error: "No information available." });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindAll Field;`);

    res.status(200).send({ data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Feild-FindAll`
    );
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Field.findOne({
      where: { id },
      include: [Profession, Subject]});

    if (!one) {
      loggerError.error(
        `ERROR: Field Not Found;  Method: ${req.method};  Field-FindOne`
      );
      return res.status(404).json({ error: "Field Not Found" });
    }

    
    loggerInfo.info(`Method: ${req.method};  Saccessfully FindOne Field;`);

    res.status(200).json({ data: one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Feild-FindOne`
    );
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = FieldValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if (value.professionId && value.subjectId) {
      loggerError.error(
        `ERROR: You cannot assign a value to subjectId and professionId at the same time!;  Method: ${req.method};  Field-Create`
      );
      return res.status(401).json({
        error:
          "You cannot assign a value to subjectId and professionId at the same time!",
      });
    }

    if (!value.professionId && !value.subjectId) {
      loggerError.error(
        `ERROR: Either professionId or subjectId must be provided.;  Method: ${req.method};  Field-Create`
      );
      return res.status(401).json({
        error: "Either professionId or subjectId must be provided.",
      });
    }
    
    if (value.professionId) {
      let professionExists = await Profession.findByPk(value.professionId);
      if (!professionExists) {
        loggerError.error(
          `ERROR: Invalid professionId: Profession does not exist.;  Method: ${req.method};  Field-Create`
        );
        return res.status(401).json({ error: "Invalid professionId: Profession does not exist." });
      }
    }

    if (value.subjectId) {
      let subjectExists = await Subject.findByPk(value.subjectId);
      if (!subjectExists) {
        loggerError.error(
          `ERROR: Invalid subjectId: Subject does not exist.;  Method: ${req.method};  Field-Create`
        );
        return res.status(401).json({ error: "Invalid subjectId: Subject does not exist." });
      }
    }

    if (value.name) { 
      let check = await Field.findOne({ where: { name: value.name } }); 
      if (check) {
        loggerError.error(
          `ERROR: Such a field exists;  Method: ${req.method};  Field-Create`
        );
        return res.status(400).json({ error: "Such a field already exists" });
      }
      }

    await Field.create(value);
    loggerInfo.info(`Method: ${req.method};  Saccessfully Create Field;`);

    res.status(201).json({ message: "Field Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Feild-Create`
    );
    res.status(500).json({ error: e.message });
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
      return res.status(401).json({ error: "Field Not Found" });
    }

    let { error, value } = FieldPatchValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Field-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    if (value.professionId && value.subjectId) {
      loggerError.error(
        `ERROR: You cannot assign a value to subjectId and professionId at the same time!;  Method: ${req.method};  Field-Update`
      );
      return res.status(401).json({
        error:
          "You cannot assign a value to subjectId and professionId at the same time!",
      });
    }

    if (!value.professionId && !value.subjectId) {
      loggerError.error(
        `ERROR: Either professionId or subjectId must be provided.;  Method: ${req.method};  Field-Update`
      );
      return res.status(401).json({
        error: "Either professionId or subjectId must be provided.",
      });
    }

    if (value.professionId) {
      let professionExists = await Profession.findByPk(value.professionId);
      if (!professionExists) {
        loggerError.error(
          `ERROR: Invalid professionId: Profession does not exist.;  Method: ${req.method};  Field-Update`
        );
        return res.status(401).json({ error: "Invalid professionId: Profession does not exist." });
      }
    }

    if (value.subjectId) {
      let subjectExists = await Subject.findByPk(value.subjectId);
      if (!subjectExists) {
        loggerError.error(
          `ERROR: Invalid subjectId: Subject does not exist.;  Method: ${req.method};  Field-Update`
        );
        return res.status(401).json({ error: "Invalid subjectId: Subject does not exist." });
    }
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await Field.update(value, { where: { id } });
    loggerInfo.info(`Method: ${req.method};  Saccessfully Update Field;`);

    res.status(201).json({ message: "Field Updated Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Feild-Update`
    );
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Field.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Field Not Found;  Method: ${req.method};  Field-Remove`
      );
      return res.status(401).json({ error: "Field Not Found" });
    }

    if (check.img) {
      deleteOldImage(check.img);
    }

    await Field.destroy({ where: { id } });
    loggerInfo.info(`Method: ${req.method};  Saccessfully Delete Field;`);

    res.status(201).json({ message: "Field Deleted Successfully!" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Feild-Delete`
    );
    res.status(500).json({ error: e.message });
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
          as: "profession",
        },
        {
          model: Subject,
          as: "subject",
        },
      ]});

    loggerInfo.info(`Method: ${req.method};  Saccessfully Search Field;`);

    if (results.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Field-Search`
      );
      return res.status(404).json({ error: "No information available." });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully Search Field;`);

    res.status(200).json({ data: results });

  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Feild-Search`
    );
    res.status(500).json({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
