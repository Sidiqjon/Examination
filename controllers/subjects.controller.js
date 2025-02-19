import Subject from "../models/subject.model.js";
import {
  SubjectPatchValidation,
  SubjectValidation,
} from "../validations/subject.validation.js";
import { Op } from "sequelize";
import { loggerInfo, loggerError } from "../logs/logger.js";

async function findAll(req, res) {
  try {
    let all = await Subject.findAll({});

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No Subjects Available.;  Method: ${req.method};  Subjects-FindAll`
      );
      return res.status(401).json({ error: "No Subjects Available. " });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindAll Subject`);
    res.status(201).send({ data: all });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Subjects-FindAll`);
    res.status(401).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Subject.findOne({ where: { id } });

    if (!one) {
      loggerError.error(
        `ERROR: Subjects Not Found;  Method: ${req.method};  Subjects-FindOne`
      );
      return res.status(401).json({ error: "Subject Not Found" });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindOne Subject`);
    res.status(201).json({ data: one });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Subjects-FindOne`);
    res.status(401).json({ error: e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = SubjectValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Subjects-Create`
      );
      return res.json({ error: error.details[0].message });
    }

    let check = await Subject.findOne({ where: { name: value.name } });

    if (check) {
      loggerError.error(
        `ERROR: Such a Subject exists;  Method: ${req.method};  Subjects-Create`
      );
      return res.status(401).json({ error: "Such a Subject exists" });
    }

    await Subject.create(value);

    loggerInfo.info(`Method: ${req.method};  Saccessfully Create Subject`);
    res.status(201).json({ message: "Created  Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Subjects-Create`);
    res.status(401).json({ error: e });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Subject.findOne({ where: { id } });

    if (!check) {
      loggerError.error(`ERROR: Subject Not Found;  Method: ${req.method};  Subjects-Update`)
      return res.status(401).json({ error: "Subject Not Found" });
    }

    let { error, value } = SubjectPatchValidation.validate(req.body);

    if (value.name) {
      let checkP = await Subject.findOne({ where: { name: value.name } });
      if (checkP) {
        loggerError.error(
          `ERROR: Such a Subject exists;  Method: ${req.method};  Subjects-Update`
        );

        return res.status(401).json({ error: "Such a Subject exists" });
      }
    }

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Subjects-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully Update Subject`);
    await Subject.update(value, { where: { id } });
    res.status(201).json({ message: "Update Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Subjects-Update`);
    res.status(401).json({ error: e });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Subject.findOne({ where: { id } });

    if (!check) {
      loggerError.error(`ERROR: Subject Not Found;  Method: ${req.method};  Subjects-Delete`);
      return res.status(401).json({ error: "Subject Not Found" });
    }

    await Subject.destroy({ where: { id } });
    loggerInfo.info(`Method: ${req.method};  Saccessfully Delete Subject`);
    res.status(201).json({ message: "Delete Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Subjects-Delete`);
    res.status(401).json({ error: e });
  }
}

async function Search(req, res) {
  try {
    let { page, take } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;

      let categories = await Subject.findAndCountAll({
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

    let results = await Subject.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
    });

    loggerInfo.info(`Method: ${req.method};  Saccessfully Search Subject; Dada: ${JSON.stringify(results)}`);
    res.json({ data: results });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Subjects-Search`);
    res.send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
