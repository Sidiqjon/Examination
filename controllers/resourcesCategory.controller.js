import ResourceCategory from "../models/resourceCategory.model.js";
import {
  ResourcesCategoryPatchValidation,
  ResourcesCategoryValidation,
} from "../validations/resourcesCategory.validation.js";
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
    let all = await ResourceCategory.findAll({include: {all: true}});

    if (all.length === 0) {
      return res.status(404).json({ error: "Resource Categories Not Found" });
    }

    res.status(201).json({ data: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await ResourceCategory.findByPk( id, {include: {all: true}});

    if (!one) {
      return res.status(404).json({ error: "Resource Category Not Found" });
    }

    res.status(201).json({ data: one });
  } catch (e) { 
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ResourcesCategoryValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let check = await ResourceCategory.findOne({
      where: { name: value.name },
    });

    if (check) {
      return res
        .status(409)
        .json({ error: "Category with this name already exists" });
    }

    let newResourceCategory = await ResourceCategory.create(value);

    if (!newResourceCategory) {
      return res.status(404).json({ error: "Resource Category Not Created.Please try again" });
    }

    res.status(201).json({ data: "Resource Category Created  Successfully", data: newResourceCategory });
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await ResourceCategory.findOne({ where: { id } });

    if (!check) {

      return res.status(404).json({ error: "Resources category Not Found" });
    }

    let { error, value } = ResourcesCategoryPatchValidation.validate(req.body);

    if (error) {

      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.name) {
      let check = await ResourceCategory.findOne({
        where: { name: value.name },
      });
      if (check) {
        return res.status(409).json({ error: "Category with this name already exists" });
      }
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await ResourceCategory.update(value, { where: { id } });

    res.status(201).json({ message: "Resource Category Updated Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await ResourceCategory.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Resource Category Not Found" });
    }

    if (check.img) {
      deleteOldImage(check.img);
    }

    await ResourceCategory.destroy({ where: { id } });

    res.status(201).json({ message: "Resource Category Deleted Successfully", data: check });
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
      let categories = await ResourceCategory.findAndCountAll({
        limit: take,
        offset: offset,
        include: {all: true}});

      if (categories.rows.length == 0) {
        return res.status(404).json({ error: "Resource Category Pages Not Found" });
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

    let results = await ResourceCategory.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: {all: true},
    });
    
    if (results.length > 0) {
      return res.status(200).json({ data: results });
    }

    return res.status(404).json({ error: "Resource Category Not Found" });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };

