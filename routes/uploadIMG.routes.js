import { Router } from "express";
import upload from "../middlewares/multer.js"

let uploadIMGRoute = Router();

uploadIMGRoute.post("/", upload.single("img"), (req, res) => {
   
   if (!req.file) {
      return res.status(400).send("No file uploaded.");
   }
   res.status(200).send({ message: `IMG uploaded: ${req.file.filename}` })
});

export default uploadIMGRoute;
