import Subject from "../models/subject.model.js";
import {
  SubjectValidation,
  SubjectPatchValidation,
} from "../validations/subject.validation.js";
import { Op } from "sequelize";
import path from "path"
import fs from "fs"

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
    let all = await Subject.findAll({ include: { all: true } });

    if (all.length === 0) {
      return res.status(404).json({ error: "No Subjects Available. " });
    }

    res.status(200).send({ data: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Subject.findOne({ where: { id }, include: { all: true } });

    if (!one) {
      return res.status(404).json({ error: "Subject Not Found" });
    }

    res.status(200).json({ data: one });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    let { error, value } = SubjectValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let check = await Subject.findOne({ where: { name: value.name } });

    if (check) {
      return res.status(409).json({ error: "Such a Subject exists!" });
    }

    let newSubject = await Subject.create(value);


    if (newSubject) {
      return res.status(201).json({ message: "New Subject Created Successfully", data: newSubject });
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

    let check = await Subject.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Subject Not Found" });
    }

    let { error, value } = SubjectPatchValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.name) {
      let checkP = await Subject.findOne({ where: { name: value.name } });
      if (checkP) {
        return res.status(409).json({ error: "Such a Subject exists!" });
      }
    }

    if (value.img) { 
      deleteOldImage(check.img); 
    }

    await Subject.update(value, { where: { id } });
    res.status(200).json({ message: "Update Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) { 
  try {
    let { id } = req.params;
    
    let check = await Subject.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Subject Not Found" });
    }

    if (check.img) {
      deleteOldImage(check.img); 
    }

    await Subject.destroy({ where: { id } });
    res.status(200).json({ message: "Subject Deleted Successfully", data: check });
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

      let categories = await Subject.findAndCountAll({
        limit: take,
        offset: offset,
        include: { all: true },
      });

      if (categories.rows.length == 0) {
        return res.status(404).json({error: "Pages Not Found"})
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

    let results = await Subject.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: {all: true}
    });


    if (results.length == 0) {
      return res.status(404).json({error: "Subjects Not Found"})
    }

    res.status(200).json({ data: results });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };

