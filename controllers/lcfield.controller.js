import LearningCenter from "../models/learningCenter.model.js";
import Field from "../models/field.model.js";
import Region from "../models/region.model.js";
import User from "../models/user.model.js";
import LCfield from "../models/lcfields.model.js";
import { Op } from "sequelize";
import { LcFieldValidation, LcFieldPatchValidation } from "../validations/lcfield.validation.js";

async function create(req, res) {
  try {

    let { error, value } = LcFieldValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let { learningCenterId, fieldId } = value;

    let check = await LearningCenter.findByPk(learningCenterId);

    if (!check) {
      return res.status(404).json({ error: "LearnignCenter Not Found!" });
    }

    if (req.user.role == "CEO") {
      if (check.createdBy != req.user.id) {
        return res.status(401).json({ error: "You are not authorized to add Field for this learningCenter!" });
      }
    }

    for (let field of fieldId) {
      await LCfield.create({ learningCenterId, fieldId: field }); 
    }

    res.status(201).json({ message: "Create Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { learningCenterId, fieldId } = req.body;

    let center = await LearningCenter.findByPk(learningCenterId);

    if (!center) {
      return res.status(404).json({ error: "Learning Center Not Found" });
    }

    if (req.user.role == "CEO") {
      if (center.createdBy != req.user.id) {
        return res.status(401).json({ error: "You are not authorized to delete Field for this learningCenter!" });
      }
    }
    
    for (let field of fieldId) {
        await LCfield.destroy({
        where: { [Op.and]: [{ learningCenterId }, { fieldId:field }] },
      });
    }

    res.status(200).json({data: "Learning Center Field Deleted Successfully"});

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export { create, remove };
