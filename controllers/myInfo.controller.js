import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import resources from "../models/resource.model.js";
import Like from "../models/like.model.js";
import LearningCenter from "../models/learningCenter.model.js";
import Branch from "../models/branch.model.js";
import UserEnrolment from "../models/userenrolment.model.js";

async function getMyInfo(req, res) {
    try {
      let user = req.user;
  
      let check = await User.findOne({
        where: { id: user.id },
        include: [
          {
            model: resources,
            attributes: ["name", "img", "media", "description"],
          },
          {
            model: Comment,
            attributes: ["comment", "star", "learningCenterId"],
          },
          {
            model: Like,
          },
          {
            model: UserEnrolment, 
            attributes: ["learningCenterId", "branchId"],
            include: [
                { model: Branch }, 
                { model: LearningCenter }
            ]
        },
        ],
      });

      if (!check) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({data: check});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}
  
export { getMyInfo };

