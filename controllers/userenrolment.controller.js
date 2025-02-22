import UserEnrolment from "../models/userenrolment.model.js";
import User from "../models/user.model.js";
import Branch from "../models/branch.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import {
  userEnrolmentValidation,
} from "../validations/userenrolment.validation.js";
import { Op } from "sequelize";


async function create(req, res) {
  try {
    const { branchId, learningCenterId } = req.body;
    let userId = req.user.id;

    if (branchId) {
      let branchExists = await Branch.findByPk(branchId);
      let check = await UserEnrolment.findOne({ where: { userId, branchId } });

      if (check) {
        return res.status(409).json({
          error: "You have previously registered with this branch.",
        });
      }
      if (!branchExists) {
        return res
          .status(404)
          .json({ error: "Invalid branchId: Branch does not exist" });
      }
    }
    if (learningCenterId) {
      let learningCenterExists = await LearningCenter.findByPk(
        learningCenterId
      );
      let check = await UserEnrolment.findOne({
        where: { userId, learningCenterId },
      });

      if (check) {
        return res.status(409).json({
          error: "You have previously registered with this learning center.",
        });
      }
      if (!learningCenterExists) {
        return res.status(404).json({
          error: "Invalid learningCenterId: Learning Center does not exist",
        });
      }
    }

    req.body.userId = userId;
    const { error, value } = userEnrolmentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await UserEnrolment.create(value);
    res.status(201).send({ message: "User Enrolment Created Successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let enrolment = await UserEnrolment.findOne({ where: { id } });
    if (!enrolment) {
      return res.status(404).json({ error: "UserEnrolment Not Found" });
    }
    await UserEnrolment.destroy({ where: { id } });
    res.status(200).send({ message: "User Enrolment Deleted Successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

export { create, remove };

