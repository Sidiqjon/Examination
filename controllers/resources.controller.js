import Resource from "../models/resource.model.js";
import {
  ResourcesPatchValidation,
  ResourcesValidation,
} from "../validations/resources.validation.js";
import User from "../models/user.model.js";
import ResourceCategory from "../models/resourceCategory.model.js";
import { Op } from "sequelize";

async function findAll(req, res) {
  try {
    let all = await Resource.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: ResourceCategory,
          attributes: ["id", "name", "img"],
        },
      ],
    });

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Resources-FindAll`
      );
      return res.status(401).json({ error: "No information available." });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindAll Resources;`
    );
    res.status(201).send({ data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Resources-FindAll`
    );
    res.status(401).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Resource.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: ResourceCategory,
          attributes: ["id", "name", "img"],
        },
      ],
    });

    if (!one) {
      loggerError.error(
        `ERROR: User Not Found;  Method: ${req.method};  Resources-FindOne`
      );
      return res.status(401).json({ error: "User Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindOne Resources;`
    );
    res.status(201).json({ data: one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Resources-FindOne`
    );
    res.status(401).json({ error: e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ResourcesValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Resources-Create`
      );
      return res.json({ error: error.details[0].message });
    }
    await Resource.create(value);

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Create Resources;`
    );
    res.status(201).json({ message: "Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Resources-Create`
    );
    res.status(401).json({ error: e });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Resource.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  Resources-Update`
      );
      return res.status(401).json({ error: "Resources Not Found" });
    }

    let { error, value } = ResourcesPatchValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Resources-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    await Resource.update(value, { where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Update Resources;`
    );
    res.status(201).json({ message: "Update Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Resources-Update`
    );
    res.status(401).json({ error: e });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Resource.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  Resources-Delete`
      );
      return res.status(401).json({ error: "Resources Not Found" });
    }

    await Resource.destroy({ where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete Resources;`
    );
    res.status(201).json({ message: "Delete Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Resources-Delete`
    );
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

      let categories = await Resource.findAndCountAll({
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

    let results = await Resource.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: ResourceCategory,
          attributes: ["id", "name", "img"],
        },
      ],
    });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Search Resources; data: ${results}`
    );
    res.status(201).json({data: results});
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  Resources-Search`
    );
    res.send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
