import LearningCenter from "../models/learningCenter.model.js";
import UserEnrolment from "../models/userenrolment.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";

async function getStudents (req, res) {
  try {
    const learningCenterId = req.params.id; 
    
    const currentUser = req.user; 
    
    const learningCenter = await LearningCenter.findByPk(learningCenterId);
    if (!learningCenter) {
      return res.status(404).json({ error: 'Learning center not found' });
    }
    if (currentUser.role === 'CEO') {
      if (learningCenter.createdBy !== currentUser.id) {
        return res.status(403).json({ error: 'You are not authorized to access this learning center' });
      }
    }

    const studentData = await UserEnrolment.findAll({
        where: { learningCenterId }, 
        include: [
          {
            model: User, 
          },
        ],
      });
  
    if (studentData.length === 0) {
      return res.status(404).json({ message: "No students found for this learning center", data: [] });
    }

    res.status(200).json({ data: studentData });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default getStudents;

