import LearningCenter from "../models/learningCenter.model.js";
import Field from "../models/field.model.js";
import Region from "../models/region.model.js";
import User from "../models/user.model.js";
import LCfield from "../models/lcfields.model.js";
import { loggerError, loggerInfo } from "../logs/logger.js";
import { Op } from "sequelize";

async function create(req, res) {
  try {
    let { fields } = req.body;

    let learningCenterIds = fields.map((item) => item.learningCenterId);
    let FieldID = fields.map((item) => item.fieldId);

    let check = await LearningCenter.findAll({
      where: { id: learningCenterIds },
      include: [
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
      ],
    });

    if (check === 0) {
      loggerError.error(
        `ERROR: LearnignCenter Not Found!;  Method: ${req.method};  LearningCenterField-Create`
      );
      return res.status(404).json({ error: "LearnignCenter Not Found!" });
    }

    try {
      for (let e of FieldID) {
        let learningCenterId = check[0]?.id;

        await LCfield.create({
          fieldId: e,
          learningCenterId: learningCenterId,
        });
      }
    } catch (e) {
      loggerError.error(
        `ERROR: Learningcenter or orientation ID error occurred;  Method: ${req.method};  LearningCenterField-Create`
      );
      return res
        .status(404)
        .json({ error: "Learningcenter or orientation ID error occurred." });
    }
    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Create LearningCenter;`
    );
    res.status(201).json({ message: "Create Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCenters-FindAll`
    );
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { learningCenterId, fieldId } = req.body;

    let center = await LearningCenter.findByPk(learningCenterId);

    if (!center) {
      return res.status(404).json({ error: "Not Found learningCenterId" });
    }
    
    for (let field of fieldId) {
      let del = await LCfield.destroy({
        where: { [Op.and]: [{ learningCenterId }, { fieldId }] },
      });
    }
    
    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete LearningCenterField;`
    );
    res.status(200).json({data: "Deleted"})

  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCentersField-Delete`
    );
    res.status(500).json({ error: e });
  }
}

export { create, remove };
