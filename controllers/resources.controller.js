import Resource from "../models/resource.model.js";
import {
  ResourcesPatchValidation,
  ResourcesValidation,
} from "../validations/resources.validation.js";
import User from "../models/user.model.js";
import ResourceCategory from "../models/resourceCategory.model.js";
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
    let all = await Resource.findAll({
      include: { all: true },
    });

    if (all.length === 0) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  Resources-FindAll`
      );
      return res.status(404).json({ error: "Resources Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindAll Resources;`
    );
    res.status(201).send({ data: all });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Resources-FindAll`
    );
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Resource.findByPk(id, { include: { all: true } });

    if (!one) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  Resources-FindOne`
      );
      return res.status(404).json({ error: "Resources Not Found" });
    }

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully FindOne Resources;`
    );
    res.status(201).json({ data: one });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Resources-FindOne`
    );
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ResourcesValidation.validate(req.body);
    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Resources-Create`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    let check = await Resource.findOne({
      where: { name: value.name },
    });
    if (check) {
      loggerError.error(
        `ERROR: Resources with this name already exists;  Method: ${req.method};  Resources-Create`
      );
      return res.status(401).json({ error: "Resources with this name already exists.Please try another name!" });}

    let checkCategory = await ResourceCategory.findOne({
      where: { id: value.categoryId },
    });
    if (!checkCategory) {
      loggerError.error(
        `ERROR: Category resource Not Found;  Method: ${req.method};  Resources-Create`
      );
      return res.status(401).json({ error: "Category Resource Not Found!" });
    }

    await Resource.create(value);

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Create Resources;`
    );
    res.status(201).json({ message: "Resource Created  Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Resources-Create`
    );
    res.status(500).json({ error: e.message });
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
      return res.status(404).json({ error: "Resource Not Found" });
    }

    if (check.createdBy !== req.user.id) {
      loggerError.error(
        `ERROR: You are not authorized to update this resource;  Method: ${req.method};  Resources-Update`
      );
      return res.status(401).json({ error: "You are not authorized to update this resource" });
    }

    let { error, value } = ResourcesPatchValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Resources-Update`
      );
      return res.status(401).json({ error: error.details[0].message });
    }

    if (value.name) {
      let check = await Resource.findOne({
        where: { name: value.name },
      });
      if (check) {
        loggerError.error(
          `ERROR: Resources with this name already exists;  Method: ${req.method};  Resources-Update`
        );
        return res.status(409).json({ error: "Resources with this name already exists.Please try another name!" });
      }
    }

    if (value.categoryId) {
      let checkCategory = await ResourceCategory.findOne({
        where: { id: value.categoryId },
      });
      if (!checkCategory) {
        loggerError.error(
          `ERROR: Category resource Not Found;  Method: ${req.method};  Resources-Update`
        );
        return res.status(404).json({ error: "Category Resource Not Found!" });
      }
    }     

    if (value.createdBy) {
      let checkUser = await User.findOne({      
        where: { id: value.createdBy },
      });
      if (!checkUser) {
        loggerError.error(
          `ERROR: User Not Found;  Method: ${req.method};  Resources-Update`
        );
        return res.status(404).json({ error: "User Not Found with provided ID!" });
      }
    }

    if(value.media) {
      deleteOldImage(check.media);
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await Resource.update(value, { where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Update Resources;`
    );
    res.status(201).json({ message: "Resource Updated Successfully!" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Resources-Update`
    );
    res.status(500).json({ error: e.message });
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
      return res.status(404).json({ error: "Resource Not Found" });
    }

    if (check.createdBy !== req.user.id) {
      loggerError.error(
        `ERROR: You are not authorized to delete this resource;  Method: ${req.method};  Resources-Delete`
      );
      return res.status(401).json({ error: "You are not authorized to delete this resource" });
    }

    if (check.media) {    
      deleteOldImage(check.media);
    } 

    if (check.img) {    
      deleteOldImage(check.img);
    }

    await Resource.destroy({ where: { id } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete Resources;`
    );
    res.status(201).json({ message: "Resource Deleted Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Resources-Delete`
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

      let categories = await Resource.findAndCountAll({
        limit: take,
        offset: offset,
        include: {all: true,}
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
      include: {all: true,}});

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Search Resources; data: ${results}`
    );

    if (results.length === 0) {
      loggerError.error(
        `ERROR: Resources Not Found;  Method: ${req.method};  Resources-Search`
      );
      return res.status(404).json({ error: "Resources Not Found" });
    }

    res.status(200).json({data:results});

  } catch (e) {
    loggerError.error(
      `ERROR: ${e.message};  Method: ${req.method};  Resources-Search`
    );
    res.status(500).send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
