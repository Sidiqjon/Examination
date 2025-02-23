import { Sequelize } from "sequelize";

let db = new Sequelize ({
    database: "SSA_examination",
    host: "localhost",
    username: "root",
    password: "root",
    timezone: "+05:00",
    dialect: "mysql",
    logging: false,
})

export default db
