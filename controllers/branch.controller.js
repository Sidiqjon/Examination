import Branch from "../models/branch.model.js";
import {

  BranchPatchValidation,
  BreanchValidation,
} from "../validations/branch.validation.js";
import Region from "../models/region.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import { Op } from "sequelize";

async function findAll(req, res) {
  try {
    let all = await Branch.findAll({
      include: [
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: LearningCenter,
          attributes: ["id", "firstName", "lastName", "role"],
        }
      ],
    });

    res.status(201).send({ data: all });
  } catch (e) {
    res.status(401).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Branch.findOne({
      where: { id },
      include: [
        {
          model: Region,
          attributes: ["id", "name"], 
        },
        {
          model: LearningCenter,
          attributes: ["id", "firstName", "lastName", "role"],
        },
      ],
    });

    if (!one) {
      return res.status(401).json({ error: "Region Not Found" });
    }

    res.status(201).json({ data: one });
  } catch (e) {
    res.status(401).json({ error: e });
  }
}

async function create(req, res) {
  try {
       let { error, value } = BreanchValidation.validate(req.body);

    let LcField = value.lcfield || [];

    for (let e of LcField) {
      let check = await Field.findOne({ where: { id: e } });

      if (!check) {
        return res
          .status(401)
          .json({ error: "There are no such IDs in the Field table!" });
      }

    }

    let newLc = await Branch.create(value);

    LcField.forEach(async (e)=> {
      await LCField.create({fieldId: e, learningCenterId: newLc.id})
    })

    res.status(201).json({ message: "Created Succesfully" });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let { id } = req.params;

    let check = await Branch.findOne({ where: { id } });

    if (!check) {
      return res.status(401).json({ error: "Learning Center Not Found" });
    }

    let { error, value } = BreanchPatchValidation.validate(req.body);

    if (error) {
      return res.status(401).json({ error: error.details[0].message });
    }
    console.log(check);

    // await LearningCenter.update(value, { where: { id } });
    // res.status(201).json({ data: "Update Successfully" });
  } catch (e) {
    res.status(401).json({ e });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Branch.findOne({ where: { id } });

    if (!check) {
      return res.status(401).json({ error: "Resources Not Found" });
    }

    await Branch.destroy({ where: { id } });
    res.status(201).json({ data: "Delete Successfully" });
  } catch (e) {
    res.status(401).json({ e });
  }
}

async function Search(req, res) {
  try {
    console.log("conditions");
    let { page, take } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;

      let categories = await Branch.findAndCountAll({
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

    let results = await Branch.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: [
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: LearningCenter,
          attributes: ["id", "firstName", "lastName", "role"],
        },
      ],
    });

    res.json(results);
  } catch (e) {
    res.send({ e: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
