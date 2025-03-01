import Field from "../models/field.model.js";
import { FieldPatchValidation, FieldValidation } from "../validations/field.validation.js";
import Profession from "../models/profession.model.js";
import Subject from "../models/subject.model.js";
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
    let all = await Field.findAll({ include: [Profession, Subject] });

    if (all.length === 0) {
      return res.status(404).json({ error: "Fields Not Found" });
    }


    res.status(200).send({ data: all });
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Field.findOne({
      where: { id },
      include: [Profession, Subject]});

    if (!one) {

      return res.status(404).json({ error: "Field Not Found" });
    }


    res.status(200).json({ data: one });
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = FieldValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if (value.professionId && value.subjectId) {

      return res.status(400).json({
        error:
          "You cannot assign a value to subjectId and professionId at the same time!",
      });
    }

    if (!value.professionId && !value.subjectId) {

      return res.status(400).json({
        error: "Either professionId or subjectId must be provided.",
      });
    }
    
    if (value.professionId) {
      let professionExists = await Profession.findByPk(value.professionId);
      if (!professionExists) {

        return res.status(404).json({ error: "Invalid professionId: Profession does not exist." });
      }
    }

    if (value.subjectId) {
      let subjectExists = await Subject.findByPk(value.subjectId);
      if (!subjectExists) {

        return res.status(404).json({ error: "Invalid subjectId: Subject does not exist." });
      }
    }

    if (value.name) { 
      let check = await Field.findOne({ where: { name: value.name } }); 
      if (check) {

        return res.status(409).json({ error: "Such a field already exists" });
      }
      }

    let newField = await Field.create(value);

    if (!newField) {

      return res.status(400).json({ error: "Something went wrong!Please try again" });
    }

    res.status(201).json({ message: "New Field Created  Successfully", data: newField });
  } catch (e) {
 
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Field.findOne({ where: { id } });

    if (!check) {
 
      return res.status(404).json({ error: "Field Not Found" });
    }

    let { error, value } = FieldPatchValidation.validate(req.body);
    if (error) {
 
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await Field.update(value, { where: { id } });

    res.status(200).json({ message: "Field Updated Successfully" });
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Field.findOne({ where: { id } });

    if (!check) {
  
      return res.status(404).json({ error: "Field Not Found" });
    }

    if (check.img) {
      deleteOldImage(check.img);
    }

    await Field.destroy({ where: { id } });

    res.status(200).json({ message: "Field Deleted Successfully!", data: check });
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

      let categories = await Field.findAndCountAll({
        limit: take,
        offset: offset,
        include: [Profession, Subject],
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
      if (!Field.rawAttributes[query.sortField]) {
        return res.status(400).json({ error: "Invalid Sort Field" });
      }
      const sortField = query.sortField;
      const sortOrder =
        query.sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
      order.push([sortField, sortOrder]);
    }

    let results = await Field.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: [Profession, Subject],});


    if (results.length === 0) {
 
      return res.status(404).json({ error: "Fields Not Found" });
    }


    res.status(200).json({ data: results });

  } catch (e) {
  
    res.status(500).json({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };

