import { Sequelize } from "sequelize";

let db = new Sequelize ({
    database: "SSA_examination",
    host: "localhost",
    username: "root",
    password: "root",
    dialect: "mysql",
    logging: false,
})

export default db
