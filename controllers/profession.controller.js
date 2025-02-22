import Profession from "../models/profession.model.js";
import { ProfessionValidation, ProfessionPatchValidation } from "../validations/profession.validation.js";
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
    let all = await Profession.findAll({include: {all: true}});

    if (all.length === 0) {
      return res.status(404).json({ error: "Professions Not Found" });
    }

    res.status(200).send({ message: "All professions:", data: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Profession.findByPk(id, {include: {all: true}});

    if (!one) {
      return res.status(404).json({ error: "Profession Not Found" });
    }

    res.status(200).json({ data: one });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = ProfessionValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let check = await Profession.findOne({ where: { name: value.name } });

    if (check) {
      return res.status(409).json({ error: "Such a profession already exists" });
    }

    let newProfession = await Profession.create(value);

    if (newProfession) {
      return res.status(201).json({ message: "New Profession Created Successfully", data: newProfession });
    }else{
      return res.status(400).json({ error: "Something went wrong!Please try again" });
    }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Profession.findByPk(id);

    if (!check) {
      return res.status(404).json({ error: "Profession Not Found" });
    }

    let { error, value } = ProfessionPatchValidation.validate(req.body);

    if (value.img) {
      deleteOldImage(check.img);
    }

    if (value.name) {
      let checkP = await Profession.findOne({ where: { name: value.name } });
      if (checkP) {
        return res.status(409).json({ error: "Such a profession already exists!" });
      }
    }

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await Profession.update(value, { where: { id } });
    res.status(200).json({ data: "Profession Update Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Profession.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Profession Not Found" });
    }

    if (check.img) {
      deleteOldImage(check.img);
    }

    await Profession.destroy({ where: { id } });


    res.status(200).json({ message: "Profession Delete Successfully",data: check });
  } catch (e) {
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
        include: { all: true },
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
      include: { all: true },
    });

    if (results.length > 0) {
      return res.status(200).json({ data: results });
    }

    return res.status(404).json({ error: "Professions Not Found with the provided query!" });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
