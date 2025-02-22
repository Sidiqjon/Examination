import winston from "winston";
const { json, timestamp, prettyPrint, combine } = winston.format;

let loggerInfo = winston.createLogger({
  level: "info",
  format: combine(json(), timestamp(), prettyPrint()),
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "logs/info.log",
    }),
    new winston.transports.File({
      level: "warn",
      filename: "logs/warning.log",
    })
  ],
});

let loggerError = winston.createLogger({
  level: "error",
  format: combine(json(), timestamp(), prettyPrint()),
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "logs/error.log",
    }),
  ],
});

export {loggerInfo, loggerError};
