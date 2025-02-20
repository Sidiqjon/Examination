import Profession from "../models/profession.model.js";
import { ProfessionValidation, ProfessionPatchValidation } from "../validations/profession.validation.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { loggerError, loggerInfo } from "../logs/logger.js";

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
    let all = await Profession.findAll({include: {all: true}});

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Profession-FindAll`
      );
      return res.status(404).json({ error: "No information available." });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindAll Profession;`);
    res.status(200).send({ message: "All professions:", data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Profession-FindAll`
    );
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Profession.findByPk(id, {include: {all: true}});

    if (!one) {
      loggerError.error(
        `ERROR: Profession Not Found;  Method: ${req.method};  Profession-FindOne`
      );
      return res.status(404).json({ error: "Profession Not Found" });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindOne Profession;`);
    res.status(200).json({ data: one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Profession-FindOne`
    );
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ProfessionValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Profession-Create`
      );
      return res.status(400).json({ error: error.details[0].message });
    }

    let check = await Profession.findOne({ where: { name: value.name } });

    if (check) {
      loggerError.error(
        `ERROR: Such a profession exists;  Method: ${req.method};  Profession-Create`
      );
      return res.status(404).json({ error: "Such a profession already exists" });
    }

    await Profession.create(value);

    loggerInfo.info(
      `Method: Created Successfully;  Saccessfully Create Profession;`
    );
    res.status(201).json({ data: "New Profession Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Profession-Create`
    );
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Profession.findByPk(id);

    if (!check) {
      loggerError.error(
        `ERROR: Profession Not Found;  Method: ${req.method};  Profession-Update`
      );
      return res.status(404).json({ error: "Profession Not Found" });
    }

    let { error, value } = ProfessionPatchValidation.validate(req.body);

    if (value.img) {
      deleteOldImage(check.img);
    }

    if (value.name) {
      let checkP = await Profession.findOne({ where: { name: value.name } });
      if (checkP) {
        loggerError.error(
          `ERROR: Such a profession exists;  Method: ${req.method};  Profession-Update`
        );
        return res.status(400).json({ error: "Such a profession already exists" });
      }
    }

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Profession-Update`
      );
      return res.status(400).json({ error: error.details[0].message });
    }

    await Profession.update(value, { where: { id } });
    loggerInfo.info(`Method: ${req.method} Created Profession Successfully;`);
    res.status(200).json({ data: "Profession Update Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Profession-Update`
    );
    res.status(500).json({ error: e.message });
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
      return res.status(404).json({ error: "Profession Not Found" });
    }

    await Profession.destroy({ where: { id } });
    if (check.img) {
      deleteOldImage(check.img);
    }

    loggerInfo.info(`Method: ${req.method} Delete Profession Successfully;`);

    res.status(200).json({ data: "Profession Deleted Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Profession-Delete`
    );
    res.status(500).json({ error: e.message });
  }
}

async function Search(req, res) {
  try {
    let { page, take } = req.query;

    if (page) {
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

    let results = await Profession.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
    });

    loggerInfo.info(
      `Method: ${req.method} Search Profession Successfully; data: ${results}`
    );

    if (results.length > 0) {
      return res.status(200).json({ data: results });
    }

    return res.status(404).json({ error: "Professions Not Found with the provided query!" });

  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Profession-Search`
    );
    res.send({ e: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
