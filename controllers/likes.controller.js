import LearningCenter from "../models/learningCenter.model.js";
import Like from "../models/like.model.js";
import User from "../models/user.model.js";
import { LikeValidation } from "../validations/like.validation.js";
import { loggerError, loggerInfo } from "../logs/logger.js";

async function create(req, res) {
  try {
    req.body.userId = req.user.id
    let { error, value } = LikeValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Like-Create`
      );
      return res.status(400).json({ error: error.details[0].message });
    }

    let checkUser = await User.findOne({where: {id: value.userId}})

    if (!checkUser) {
      loggerError.error(
        `ERROR: User Not Found;  Method: ${req.method};  Like-Create`
      );
      return res.status(404).json({ error: "User Not Found with this Id" });
    }

    let checkLear = await LearningCenter.findOne({where: {id: value.learningCenterId}})

    if (!checkLear) {
      loggerError.error(
        `ERROR: LearningCenter Not Found;  Method: ${req.method};  Like-Create`
      );
      return res.status(404).json({ error: "LearningCenter Not Found with this Id" });
    }

    let check = await Like.findOne({
      where: { userId: value.userId, learningCenterId: value.learningCenterId },});

    if (check) {
      loggerError.error(
        `ERROR: Siz Like Bosib Bo'lgansiz😊;  Method: ${req.method};  Like-Create`
      );
      return res.status(409).json({ error: "You have already liked" });
    }

    await Like.create(value)

    loggerInfo.info(`Method: ${req.method};  Successfully Create Like;`);
    res.status(201).json({ message: "Liked  Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e.message};  Method: ${req.method};  Likes-Create`);
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let check = await Like.findOne({ where: { id } });

    if (!check) {
      loggerError.error(
        `ERROR: Liked Not Found;  Method: ${req.method};  Like-Delete`
      );
      return res.status(404).json({ error: "Like Not Found" });
    }

    if (req.user.id !== check.userId) {
      return res.status(403).json({error: "You can't delete someone else's like."})
    }

    await Like.destroy({ where: { id } });

    loggerInfo.info(`Method: ${req.method};  Successfully Deleted Like;`);
    res.status(200).json({ message: "Like Deleted Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e.message};  Method: ${req.method};  Likes-Delete`);
    res.status(500).json({ error: e.message });
  }
}

export { create, remove };

