import LearningCenter from "../models/learningCenter.model.js";
import {
  LearningCenterPatchValidation,
  LearningCenterValidation,
} from "../validations/learningcenter.validation.js";
import Region from "../models/region.model.js";
import User from "../models/user.model.js";
import { Op, fn, col, literal } from "sequelize";
import LCField from "../models/lcfields.model.js";
import Field from "../models/field.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import Branch from "../models/branch.model.js";

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
    let all = await LearningCenter.findAll({
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) 
              FROM Likes 
              WHERE Likes.learningCenterId = LearningCenter.id
            )`),
            "numberOfLikes",
          ],
        ],
      },
      include: [
        {
          model: Branch,
          attributes: ["id", "name", "img", "regionId", "phoneNumber", "address"],
        },
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: Field,
          attributes: ["id", "name", "professionId", "subjectId"],
        },
        {
          model: Comment,
          attributes: ["id", "comment", "userId", "star"],
        },
      ],
      subQuery: false, 
    });


    if (all.length === 0) {
      return res.status(404).json({ error: "Learning Centers Not Found" });
    }



    res.status(200).send({ data: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
async function findOne(req, res) {
  try {
    let { id } = req.params;

    let one = await LearningCenter.findOne({
      where: { id },
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) 
              FROM Likes 
              WHERE Likes.learningCenterId = LearningCenter.id
            )`),
            "numberOfLikes",
          ],
        ],
      },
      include: [
        {
          model: Branch,
          attributes: ["id", "name", "img", "regionId", "phoneNumber", "address"],
        },
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: Field,
          attributes: ["id", "name", "professionId", "subjectId"],
        },
        {
          model: Comment,
          attributes: ["id", "comment", "userId", "star"],
        },
      ],
      subQuery: false, 
    });

    if (!one) {
      return res.status(404).json({ error: "Learning Center Not Found" });
    }

    res.status(200).json({ data: one });
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    req.body.createdBy = req.user.id;
    let { error, value } = LearningCenterValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let checkName = await LearningCenter.findOne({
      where: { name: value.name },
    });

    if (checkName) {
      return res
        .status(409)
        .json({ error: "Learning Center with this name already exists!" });
    }

    let checkRegion = await Region.findByPk(value.regionId);

    if (!checkRegion) {
      return res
        .status(404)
        .json({ error: "There is no such region with this ID" });
    }

    let LcField = value.lcfield || [];

    for (let field of LcField) {
      let check = await Field.findOne({ where: { id: field } });

      if (!check) {
        return res
          .status(404)
          .json({ error: "There is no such field available with this ID" });
      }
    }

    let newLc = await LearningCenter.create(value);

    if (!newLc) {
      return res.status(400).json({ error: "Learning Center Not Created.Please try again" });
    }

    LcField.forEach(async (field) => {
      await LCField.create({ fieldId: field, learningCenterId: newLc.id });
    });


    res.status(201).json({ message: "New Learning Center Created Succesfully" });
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {

    let { id } = req.params;

    let check = await LearningCenter.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Learning Center Not Found" });
    }

    if (req.user.role != "ADMIN" && check.createdBy != req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this Learning Center" });
    }

    let { error, value } = LearningCenterPatchValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.regionId) {
      let checkRegion = await Region.findByPk(value.regionId);

      if (!checkRegion) {
        return res
          .status(404)
          .json({ error: "There is no such region with this ID" });
      }
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await LearningCenter.update(value, { where: { id } });
    res.status(200).json({ message: "Learning Center Updated Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await LearningCenter.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Learning Center Not Found" });
    }

    if (req.user.role != "ADMIN" && check.createdBy != req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this Learning Center" });
    }

    if (value.img) {
      deleteOldImage(check.img);
    }

    await LearningCenter.destroy({ where: { id } });
    res.status(201).json({ message: "Learning Center Deleted Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function Search(req, res) {
  try {
    
    let { page, take, regionId } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;
      let offset = (page - 1) * take;

      let categories = await LearningCenter.findAndCountAll({
        limit: take,
        offset: offset,
        attributes: {
          include: [
            [
              literal(`(
                SELECT COUNT(*) 
                FROM Likes 
                WHERE Likes.learningCenterId = LearningCenter.id
              )`),
              "numberOfLikes",
            ],
          ],
        },
        include: [
          {
            model: Branch,
            attributes: ["id", "name", "img", "regionId", "phoneNumber", "address"],
          },
          {
            model: Region,
            attributes: ["id", "name"],
          },
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "role"],
          },
          {
            model: Field,
            attributes: ["id", "name", "professionId", "subjectId"],
          },
          {
            model: Comment,
            attributes: ["id", "comment", "userId", "star"],
          },
        ],
        subQuery: false, 
      });

      if (categories.rows.length === 0) {
        return res.status(404).json({ error: "Learning Centers Not Found" });
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
      if (key !== "sortField" && key !== "sortOrder" && key !== "regionId") {
        conditions[key] = {
          [Op.like]: `%${query[key]}%`,
        };
      }
    });

  
    if (regionId) {
      let regionIds = Array.isArray(regionId) ? regionId : [regionId];
      conditions.regionId = {
        [Op.in]: regionIds.map((id) => parseInt(id, 10)),
      };
    }

    if (query.sortField && query.sortOrder) {
      const sortField = query.sortField;
      const sortOrder =
        query.sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
      order.push([sortField, sortOrder]);
    }

    let results = await LearningCenter.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) 
              FROM Likes 
              WHERE Likes.learningCenterId = LearningCenter.id
            )`),
            "numberOfLikes",
          ],
        ],
      },
      include: [
        {
          model: Branch,
          attributes: ["id", "name", "img", "regionId", "phoneNumber", "address"],
        },
        {
          model: Region,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "role"],
        },
        {
          model: Field,
          attributes: ["id", "name", "professionId", "subjectId"],
        },
        {
          model: Comment,
          attributes: ["id", "comment", "userId", "star"],
        },
      ],
      subQuery: false, 
    });

    if (results.length === 0) {
      return res.status(404).json({ error: "Learning Centers Not Found" });
    }

    res.status(201).json({ data: results });
  } catch (e) {
    res.send({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove, Search };
