import ResourceCategory from "../models/resourceCategory.model.js";
import {
  ResourcesCategoryPatchValidation,
  ResourcesCategoryValidation,
} from "../validations/resourcesCategory.validation.js";
import { Op } from "sequelize";
import { loggerError, loggerInfo } from "../logs/logger.js";

async function findAll(req, res) {
  try {
    let all = await ResourceCategory.findAll();

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  ResourceCategory-FindAll`
      );
      return res.status(401).json({ error: "No information available." });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindAll ResourceCategory;`
    );
    res.status(201).send({ all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-FindAll`
    );
    res.status(401).json({ e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await ResourceCategory.findOne({ where: { id } });

    if (!one) {
      loggerError.error(
        `ERROR: User Not Found.;  Method: ${req.method};  ResourceCategory-FindOne`
      );
      return res.status(401).json({ error: "User Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindOne ResourceCategory;`
    );
    res.status(201).json({ one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-FindOne`
    );
    res.status(401).json({ e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ResourcesCategoryValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  ResourceCategory-Create`
      );
      return res.json({ error: error.details[0].message });
    }

    let check = await ResourceCategory.findOne({
      where: { name: value.name },
    });

    if (check) {
      loggerError.error(
        `ERROR: Bunday Namelik Resouces Category mavjud;  Method: ${req.method};  ResourceCategory-Create`
      );
      return res
        .status(401)
        .json({ error: "Bunday Namelik Resouces Category mavjud" });
    }

    await ResourceCategory.create(value);

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Create ResourceCategory;`
    );
    res.status(201).json({ data: "Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-Create`
    );
    res.status(401).json({ e });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await ResourceCategory.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  ResourceCategory-Update`
      );
      return res.status(401).json({ error: "Resources Not Found" });
    }

    let { error, value } = ResourcesCategoryPatchValidation.validate(req.body);

    if (value.name) {
      let check = await ResourceCategory.findOne({
        where: { name: value.name },
      });
      if (check) {
        loggerError.error(
          `ERROR: Bunday Namelik Resouces Category mavjud;  Method: ${req.method};  ResourceCategory-Update`
        );
        return res
          .status(401)
          .json({ error: "Bunday Namelik Resouces Category mavjud" });
      }
    }

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  ResourceCategory-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    await ResourceCategory.update(value, { where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Update ResourceCategory;`
    );
    res.status(201).json({ data: "Update Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-Update`
    );
    res.status(401).json({ e });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await ResourceCategory.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  ResourceCategory-Delete`
      );
      return res.status(401).json({ error: "Resources Not Found" });
    }

    await ResourceCategory.destroy({ where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete ResourceCategory;`
    );
    res.status(201).json({ data: "Delete Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-Delete`
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

      let categories = await ResourceCategory.findAndCountAll({
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

    let results = await ResourceCategory.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
    });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Search ResourceCategory; data: ${results}`
    );
    res.json(results);
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  ResourceCategory-Search`
    );
    res.send({ e: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
