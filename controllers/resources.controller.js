import Resource from "../models/resource.model.js";
import {
  ResourcesPatchValidation,
  ResourcesValidation,
} from "../validations/resources.validation.js";
import User from "../models/user.model.js";
import ResourceCategory from "../models/resourceCategory.model.js";
import { Op } from "sequelize";
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
      return res.status(404).json({ error: "Resources Not Found" });
    }

    res.status(200).send({ data: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Resource.findByPk(id, { include: { all: true } });

    if (!one) {
      return res.status(404).json({ error: "Resources Not Found" });
    }

    res.status(200).json({ data: one });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    req.body.createdBy = req.user.id;
    let { error, value } = ResourcesValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let check = await Resource.findOne({
      where: { name: value.name },
    });
    if (check) {
      return res.status(409).json({ error: "Resources with this name already exists.Please try another name!" });}

    let checkCategory = await ResourceCategory.findOne({
      where: { id: value.categoryId },
    });
    if (!checkCategory) {
      return res.status(404).json({ error: "Category Resource Not Found!" });
    }

    let newResource = await Resource.create(value);

    if (!newResource) {
      return res.status(400).json({ error: "Resource Not Created.Please try again" });
    }

    res.status(201).json({ message: "Resource Created  Successfully", data: newResource });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Resource.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Resource Not Found" });
    }

    if (check.createdBy !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to update this resource" });
    }

    let { error, value } = ResourcesPatchValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.name) {
      let check = await Resource.findOne({
        where: { name: value.name },
      });
      if (check) {
        return res.status(409).json({ error: "Resources with this name already exists.Please try another name!" });
      }
    }

    if (value.categoryId) {
      let checkCategory = await ResourceCategory.findOne({
        where: { id: value.categoryId },
      });
      if (!checkCategory) {
        return res.status(404).json({ error: "Category Resource Not Found with provided ID" });
      }
    }     

    if(value.media) {
      deleteOldImage(check.media);
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await Resource.update(value, { where: { id } });

    res.status(200).json({ message: "Resource Updated Successfully!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Resource.findOne({ where: { id } });

    if (!check) {

      return res.status(404).json({ error: "Resource Not Found" });
    }

    if (check.createdBy !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this resource" });
    }

    if (check.media) {    
      deleteOldImage(check.media);
    } 

    if (check.img) {    
      deleteOldImage(check.img);
    }

    await Resource.destroy({ where: { id } });

    res.status(200).json({ message: "Resource Deleted Successfully", data: check });
  } catch (e) {
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

      if (categories.rows.length == 0) {
        return res.status(404).json({ error: "Resource Pages Not Found" });
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

    let results = await Resource.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: {all: true,}});

    if (results.length === 0) {
      return res.status(404).json({ error: "Resources Not Found" });
    }

    res.status(200).json({data:results});

  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
