// import LearningCenter from "../models/learningCenter.model.js";
// import Branch from "../models/branch.model.js";
// import User from "../models/user.model.js";
// import Region from "../models/region.model.js";
// import Comment from "../models/comment.model.js";
// import Like from "../models/like.model.js";
// import { Op, fn, col, literal } from "sequelize";
// import { Sequelize } from "sequelize";

// export async function getMyCenters(req, res) {
//     try {
//        let { id } = req.user;

//        let centers = await LearningCenter.findAll({ where: { createdBy: id } }, { attributes:{include: [[Sequelize.fn("COUNT", Sequelize.col("likes.id")), "numberOfLikes"]]}, include: { model: Branch }, include: { model: User, attributes: { exclude: ["password"] } }, include: {model: Region}, include: {model: Comment},include: {model: Like} });

//        if (centers.length === 0) {
//           return res.status(404).json({ message: "Learning centers not found! You have no Learning centers yet!" });
//        }

//        res.status(200).json({ data: centers });
//     } catch (error) {
//        res.status(500).json({ message: error.message });
//     }
// }

import LearningCenter from "../models/learningCenter.model.js";
import Branch from "../models/branch.model.js";
import User from "../models/user.model.js";
import Region from "../models/region.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { Sequelize } from "sequelize";

export async function getMyCenters(req, res) {
    try {
        let { id } = req.user;

        let centers = await LearningCenter.findAll({
            where: { createdBy: id },
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("likes.id")), "numberOfLikes"]],
            },
            include: [
                { model: Branch },
                { model: User, attributes: { exclude: ["password"] } },
                { model: Region },
                { model: Comment },
                { model: Like },
            ],
            group: [
                "learningCenter.id",  
                "branches.id",
                "user.id",
                "region.id",
                "comments.id",
                "likes.id"
            ],
        });

        if (centers.length === 0) {
            return res.status(404).json({ message: "Learning centers not found! You have no Learning centers yet!" });
        }

        res.status(200).json({ data: centers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
