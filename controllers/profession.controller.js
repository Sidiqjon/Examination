import Profession from "../models/profession.model.js";
import {
  ProfessionPatchValidation,
  ProfessionValidation,
} from "../validations/profession.validation.js";
import { Op } from "sequelize";
import { loggerError, loggerInfo } from "../logs/logger.js";

async function findAll(req, res) {
  try {
    let all = await Profession.findAll({});

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Profession-FindAll`
      );
      return res.status(401).json({ error: "No information available." });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindAll Profession;`);
    res.status(201).send({ data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Profession-FindAll`
    );
    res.status(401).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Profession.findOne({ where: { id } });

    if (!one) {
      loggerError.error(
        `ERROR: Profession Not Found;  Method: ${req.method};  Profession-FindOne`
      );
      return res.status(401).json({ error: "Profession Not Found" });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindOne Profession;`);
    res.status(201).json({ one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Profession-FindOne`
    );
    res.status(401).json({ e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ProfessionValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Profession-Create`
      );
      return res.json({ error: error.details[0].message });
    }

    let check = await Profession.findOne({ where: { name: value.name } });

    if (check) {
      loggerError.error(
        `ERROR: Such a profession exists;  Method: ${req.method};  Profession-Create`
      );
      return res.status(401).json({ error: "Such a profession exists" });
    }

    

    await Profession.create(value);

    loggerInfo.info(
      `Method: Created Successfully;  Saccessfully Create Profession;`
    );
    res.status(201).json({ data: "Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Profession-Create`
    );
    res.status(401).json({ e });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Profession.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Profession Not Found;  Method: ${req.method};  Profession-Update`
      );
      return res.status(401).json({ error: "Profession Not Found" });
    }

    let { error, value } = ProfessionPatchValidation.validate(req.body);

    if (value.name) {
      let checkP = await Profession.findOne({ where: { name: value.name } });
      if (checkP) {
        loggerError.error(
          `ERROR: Such a profession exists;  Method: ${req.method};  Profession-Update`
        );
        return res.status(401).json({ error: "Such a profession exists" });
      }
    }

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Profession-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    await Profession.update(value, { where: { id } });
    loggerInfo.info(`Method: ${req.method} Created Profession Successfully;`);
    res.status(201).json({ data: "Update Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Profession-Update`
    );
    res.status(401).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Profession.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Profession Not Found;  Method: ${req.method};  Profession-Delete`
      );
      return res.status(401).json({ error: "Profession Not Found" });
    }

    await Profession.destroy({ where: { id } });
    loggerInfo.info(`Method: ${req.method} Delete Profession Successfully;`);

    res.status(201).json({ data: "Delete Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Profession-Delete`
    );
    res.status(401).json({ e });
  }
}

async function Search(req, res) {
  try {
    let { page, take } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;

      let categories = await Profession.findAndCountAll({
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
      if (key !== "sortField" && key !== "sortOrder" && query[key]) {
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

    let results = await Profession.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
    });

    loggerInfo.info(
      `Method: ${req.method} Search Profession Successfully; data: ${results}`
    );

    res.json(results);
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Profession-Search`
    );
    res.send({ e: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
