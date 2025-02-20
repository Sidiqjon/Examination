import ResourceCategory from "../models/resourceCategory.model.js";
import {
  ResourcesCategoryPatchValidation,
  ResourcesCategoryValidation,
} from "../validations/resourcesCategory.validation.js";
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
    let all = await ResourceCategory.findAll({include: {all: true}});

    if (all.length === 0) {
      loggerError.error(
        `ERROR: Resource Category Not Found;  Method: ${req.method};  ResourceCategory-FindAll`
      );
      return res.status(404).json({ error: "Resource Categories Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Successfully FindAll ResourceCategory;`
    );
    res.status(201).json({ data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  ResourceCategory-FindAll`
    );
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await ResourceCategory.findByPk( id, {include: {all: true}});

    if (!one) {
      loggerError.error(
        `ERROR: User Not Found.;  Method: ${req.method};  ResourceCategory-FindOne`
      );
      return res.status(404).json({ error: "Resource Category Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindOne ResourceCategory;`
    );
    res.status(201).json({ data: one });
  } catch (e) { 
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  ResourceCategory-FindOne`
    );
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ResourcesCategoryValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  ResourceCategory-Create`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    let check = await ResourceCategory.findOne({
      where: { name: value.name },
    });

    if (check) {
      loggerError.error(
        `ERROR: Category with this name already exists;  Method: ${req.method};  ResourceCategory-Create`
      );
      return res
        .status(409)
        .json({ error: "Category with this name already exists" });
    }

    await ResourceCategory.create(value);

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Create ResourceCategory;`
    );
    res.status(201).json({ data: "Resource Category Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  ResourceCategory-Create`
    );
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await ResourceCategory.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Resources Category Not Found;  Method: ${req.method};  ResourceCategory-Update`
      );
      return res.status(404).json({ error: "Resources category Not Found" });
    }

    let { error, value } = ResourcesCategoryPatchValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  ResourceCategory-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    if (value.name) {
      let check = await ResourceCategory.findOne({
        where: { name: value.name },
      });
      if (check) {
        loggerError.error(
          `ERROR: Category with this name already exists;  Method: ${req.method};  ResourceCategory-Update`
        );
        return res.status(401).json({ error: "Category with this name already exists" });
      }
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await ResourceCategory.update(value, { where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Update ResourceCategory;`
    );
    res.status(201).json({ data: "Resource Category Updated Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  ResourceCategory-Update`
    );
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await ResourceCategory.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Resource Category Not Found;  Method: ${req.method};  ResourceCategory-Delete`
      );
      return res.status(401).json({ error: "Resource Category Not Found" });
    }

    if (check.img) {
      deleteOldImage(check.img);
    }

    await ResourceCategory.destroy({ where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete ResourceCategory;`
    );
    res.status(201).json({ data: "Resource Category Deleted Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  ResourceCategory-Delete`
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
      let categories = await ResourceCategory.findAndCountAll({
        limit: take,
        offset: offset,
        include: {all: true}});

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

    let results = await ResourceCategory.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: {all: true},
    });
    
    if (results.length > 0) {
      loggerInfo.info(
        `Method: ${req.method};  Saccessfully Search ResourceCategory; data: ${results}`
      );
      return res.status(200).json({ data: results });
    }

    loggerError.error(
      `ERROR: Resource Category Not Found;  Method: ${req.method};  ResourceCategory-Search`
    );
    return res.status(404).json({ error: "Resource Category Not Found" });

  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-Search`
    );
    res.send({ e: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
