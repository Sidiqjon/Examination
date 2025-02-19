import { Sequelize } from "sequelize";

let db = new Sequelize ({
    database: "SSA_examination",
    host: "localhost",
    username: "root",
    password: "1234",
    dialect: "mysql",
    logging: false,
})

export default db
                      