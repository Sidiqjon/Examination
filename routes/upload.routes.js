import { Router } from "express";
import upload from "../middlewares/multer.js"

let route = Router();

route.post("/", upload.single("img"), (req, res) => {
  res.json({img: req.file.filename});
});

export default route
