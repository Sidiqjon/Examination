import LearningCenter from "../models/learningCenter.model.js";

export async function getMyCenters(req, res) {
    try {
       let { id } = req.user;
 
       let centers = await LearningCenter.findAll({ where: { createdBy: id } }, { include: { all: true } });
 
       if (centers.length === 0) {
          return res.status(404).json({ message: "Learning centers not found! You have no Learning centers yet!" });
       }
 
       res.status(200).json({ data: centers });
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
}
