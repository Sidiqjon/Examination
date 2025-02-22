import LearningCenter from "../models/learningCenter.model.js";
import Like from "../models/like.model.js";
import User from "../models/user.model.js";
import { LikeValidation } from "../validations/like.validation.js";

async function create(req, res) {
  try {
    req.body.userId = req.user.id
    let { error, value } = LikeValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let checkUser = await User.findOne({where: {id: value.userId}})

    if (!checkUser) {
      return res.status(404).json({ error: "User Not Found with this Id" });
    }

    let checkLear = await LearningCenter.findOne({where: {id: value.learningCenterId}})

    if (!checkLear) {
      return res.status(404).json({ error: "LearningCenter Not Found with this Id" });
    }

    let check = await Like.findOne({
      where: { userId: value.userId, learningCenterId: value.learningCenterId },});

    if (check) {
      return res.status(409).json({ error: "You have already liked" });
    }

    await Like.create(value)

    res.status(201).json({ message: "Liked  Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Like.findOne({ where: { id } });

    if (!check) {
      return res.status(404).json({ error: "Like Not Found" });
    }

    if (req.user.id !== check.userId) {
      return res.status(403).json({error: "You can't delete someone else's like."})
    }

    await Like.destroy({ where: { id } });

    res.status(200).json({ message: "Like Deleted Successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export { create, remove };

