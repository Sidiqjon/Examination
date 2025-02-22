import Branch from "../models/branch.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import Region from "../models/region.model.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { BranchValidation, BranchPatchValidation } from "../validations/branch.validation.js";

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
    const { page, take = 5, sortField, sortOrder, ...filters } = req.query;

    let whereClause = {};
    let orderClause = [["id", "ASC"]];

    Object.keys(filters).forEach((key) => {
      whereClause[key] = { [Op.like]: `%${filters[key]}%` };
    });

    if (sortField && sortOrder) {
      orderClause = [[sortField, sortOrder.toUpperCase()]];
    }

    let offset = 0;
    let limit = null;
    if (page) {
      offset = (parseInt(page, 10) - 1) * parseInt(take, 10);
      limit = parseInt(take, 10);
    }

    const { count, rows } = await Branch.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: limit,
      offset: offset,
      include: {all: true},});

    if (rows.length === 0) {
      return res.status(404).json({ error: "No branches found." });
    }

    res.status(200).json({
      totalItems: count,
      totalPages: limit ? Math.ceil(count / limit) : 1,
      currentPage: page ? parseInt(page, 10) : 1,
      data: rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function findOne(req, res) {
  try {
    const { id } = req.params;
    const branch = await Branch.findOne({
      where: { id },
      include: {all: true},});

    if (!branch) {
      return res.status(404).json({ error: "Branch not found." });
    }

    res.status(200).json({ data: branch });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const { name, phoneNumber, img, address, regionId, learningCenterId } = req.body;
    
    let checkLC = await LearningCenter.findByPk(learningCenterId)
    let checkRegion = await Region.findByPk(regionId)

    if (!checkLC) {
      return res.status(404).json({ error: "The Learnig Center with the provided 'ID' Does Not exist!" });
    }

    if (checkLC.createdBy != req.user.id && req.user.role != "ADMIN") {
      return res.status(403).json({ message: "You Are Not Allowed to create a Branch!" })
    }

    if (!checkRegion) {
      return res.status(404).json({ error: "The Region with the provided 'ID' Does Not exist!" });
    }

    if (name) {
      let checkName = await Branch.findOne({ where: { name } });    
      if (checkName) {
        return res.status(409).json({ error: "Branch with this name already exists" });
      }
    }

    let { error, value } = BranchValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newBranch = await Branch.create(value);

    let branchNumber = checkLC.branchNumber + 1
    await checkLC.update({ branchNumber })

    res.status(201).json({ message: "Branch created successfully.", data: newBranch });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { img, regionId, ...updateData } = req.body;

    const branch = await Branch.findOne({ where: { id } });
    if (!branch) {
      return res.status(404).json({ error: "Branch not found." });
    }

    let LC = await LearningCenter.findByPk(branch.learningCenterId)
    
    if (LC.createdBy != req.user.id && req.user.role != "ADMIN") {
      return res.status(403).json({ message: "You Are Not Allowed to update this Branch!" })
    }

    let { error, value } = BranchPatchValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (regionId) {
      let checkRegion = await Region.findByPk(regionId)
      if (!checkRegion) {
        return res.status(404).json({ error: "The Region with the provided 'ID' Does Not exist!" });
      }
    }

    if (req.body.name) {
      let checkName = await Branch.findOne({ where: { name: req.body.name } });    
      if (checkName) {
        return res.status(409).json({ error: "Branch with this name already exists" });
      }
    }

    if (img) {
      deleteOldImage(branch.img);
    }

    await Branch.update(value, { where: { id } });
    res.status(200).json({ message: "Branch updated successfully." });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const branch = await Branch.findOne({ where: { id } });

    if (!branch) {
      return res.status(404).json({ error: "Branch not found." });
    }

    const LC = await LearningCenter.findByPk(branch.learningCenterId)
    
    if (LC.createdBy != req.user.id && req.user.role != "ADMIN") {        
      return res.status(403).json({ message: "You Are Not Allowed to delete this Branch!" })
    }

    if (branch.img) {
      deleteOldImage(branch.img);
    }

    await Branch.destroy({ where: { id } });

    let branchNumber = LC.branchNumber - 1
    await LC.update({ branchNumber })

    res.status(200).json({ message: "Branch deleted successfully.", data: branch });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export { findAll, findOne, create, update, remove };
