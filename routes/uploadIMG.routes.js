import { Router } from "express";
import upload from "../middlewares/multer.js"

let uploadIMGRoute = Router();

uploadIMGRoute.post("/", upload.single("img"), (req, res) => {
   
   if (!req.file) {
      return res.status(400).send("No file uploaded.");
   }
   res.status(201).send({ message: `IMG uploaded: ${req.file.filename}` })
});

export default uploadIMGRoute;

/**
 * @swagger
 * /api/upload-img:
 *   post:
 *     summary: 📷 Upload an Image
 *     description: Upload a single image file. The uploaded file is stored in the server and returned with its filename.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "IMG uploaded: 1708392837642.jpg"
 *       400:
 *         description: No file uploaded.
 *       500:
 *         description: Internal server error.
 */
