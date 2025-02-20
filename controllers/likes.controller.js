import LearningCenter from "../models/learningCenter.model.js";
import Like from "../models/like.model.js";
import User from "../models/user.model.js";
import { LikeValidation } from "../validations/like.validation.js";
import { loggerError, loggerInfo } from "../logs/logger.js";

async function findAll(req, res) {
  try {
    let all = await Like.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: LearningCenter,
          attributes: ["id", "name", "address"],
        },
      ],
    });

    if (all.length === 0) {
      loggerError.error(
        `ERROR: No information available.;  Method: ${req.method};  Like-FindAll`
      );
      return res.status(404).json({ error: "No information available." });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindAll Like;`);
    res.status(200).send({ data: all });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Likes-FindOne`);
    res.status(500).json({ error: e });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let one = await Like.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: LearningCenter,
          attributes: ["id", "name", "address"],
        },
      ],
    });

    if (!one) {
      loggerError.error(
        `ERROR: User Not Found;  Method: ${req.method};  Like-FindOne`
      );
      return res.status(404).json({ error: "User Not Found" });
    }

    loggerInfo.info(`Method: ${req.method};  Saccessfully FindOne Like;`);
    res.status(200).json({ data: one });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Likes-FindOne`);
    res.status(500).json({ error: e });
  }
}

async function create(req, res) {
  try {
    let { error, value } = LikeValidation.validate(req.body);

    if (error) {
      loggerError.error(
        `ERROR: ${error.details[0].message};  Method: ${req.method};  Like-Create`
      );
      return res.json({ error: error.details[0].message });
    }

    let checkUser = await User.findOne({where: {id: value.userId}})

    if (!checkUser) {
      loggerError.error(
        `ERROR: UserId Not Found;  Method: ${req.method};  Like-Create`
      );
      return res.status(404).json({ error: "UserId Not Found" });
    }

    let checkLear = await LearningCenter.findOne({where: {id: value.learningCenterId}})

    if (!checkLear) {
      loggerError.error(
        `ERROR: LearningCenter Not Found;  Method: ${req.method};  Like-Create`
      );
      return res.status(404).json({ error: "LearningCenter Not Found" });
    }

    let check = await Like.findOne({
      where: { userId: value.userId, learningCenterId: value.learningCenterId },
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: LearningCenter,
          attributes: ["id", "name", "address"],
        },
      ],
    });



    if (check) {
      loggerError.error(
        `ERROR: Siz Like Bosib Bo'lgansiz😊;  Method: ${req.method};  Like-Create`
      );
      return res.status(409).json({ error: "Siz Like Bosib Bo'lgansiz😊" });
    }

    await Like.create(value);

    loggerInfo.info(`Method: ${req.method};  Saccessfully Create Like;`);
    res.status(201).json({ message: "Liked  Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Likes-Create`);
    res.status(500).json({ error: e });
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
      return res.status(404).json({ error: "Liked Not Found" });
    }

    await Like.destroy({ where: { id } });

    loggerInfo.info(`Method: ${req.method};  Saccessfully Delete Like;`);
    res.status(200).json({ message: "Delete Like Successfully" });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Likes-Delete`);
    res.status(500).json({ error: e });
  }
}

async function Search(req, res) {
  try {
    let { create } = req.query;

    create = create || "ASC";

    let check = await Like.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname"],
        },
        {
          model: LearningCenter,
          attributes: ["id", "name", "address"],
        },
      ],
      order: [["createdAt", create.toUpperCase()]],
    });

    loggerInfo.info(`Method: ${req.method};  Saccessfully Search Like;`);
    return res.status(200).json({ data: check });
  } catch (e) {
    loggerError.error(`ERROR: ${e};  Method: ${req.method};  Likes-Search`);
    res.status(500).send({ error: e.message });
  }
}

export { findAll, findOne, create, remove, Search };
