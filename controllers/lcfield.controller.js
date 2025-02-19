import LearningCenter from "../models/learningCenter.model.js";
import Field from "../models/field.model.js";
import Region from "../models/region.model.js";
import User from "../models/user.model.js";
import LCfield from "../models/lcfields.model.js";

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
      return res.status(401).json({ error: "LearnignCenter Not Found!" });
    }

    let learning_CenterIds = check.map((lc) => lc.id);

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
        .status(401)
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
    res.status(401).json({ error: e.message });
  }
}

async function remove(req, res) {
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

    if (!check) {
      loggerError.error(
        `ERROR: Learnign Center Not Found!;  Method: ${req.method};  LearningCenterField-Delete`
      );
      return res.status(401).json({ error: "Learnign Center Not Found!" });
    }

    await Field.destroy({ where: { id: FieldID } });

    loggerInfo.info(
      `Method: ${req.method};  Saccessfully Delete LearningCenterField;`
    );
    res.status(201).json({ message: "Delete Successfully" });
  } catch (e) {
    loggerError.error(
      `ERROR: ${e};  Method: ${req.method};  LearningCentersField-Delete`
    );
    res.status(401).json({ error: e });
  }
}

export { create, remove };
