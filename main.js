import express from "express"
import db from "./config/db.js"
import mainRoute from "./routes/index.js"
import dotenv from "dotenv"
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config()
const PORT = process.env.PORT || 4000

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Examination",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
      },
      servers: [
        {
          url: "http://localhost:3000/",
        },
      ],
    },
    apis: ["./routes/*.js"],
};
  
const specs = swaggerJsdoc(options);

const app = express()

app.use(express.json())

app.use("/api", mainRoute)


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("*", (req, res) => {
    res.status(400).send({msg: "Route Not Found!"})
})

async function bootstrap() {
  try {
      await db.sync()
      // await db.sync({force: true})
      console.log("Connected to DB ✅");
      app.listen(PORT, () => {
          console.log(`Server started on Port: ${PORT} 🟢`);
      })
  } catch (error) {
      console.log(error.message);
  }
}

bootstrap()
