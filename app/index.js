const express = require("express");
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const initModels = require("./models/init-models");
const sessionRoute = require("./routes/session")

const app = express();
app.use(bodyParser.json());
app.use(fileUpload());
require("dotenv").config();

//DB Connection 
const USER = process.env.DB_USER;
const PSWD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const PORT = process.env.DB_PORT; 
var opts = {
  logging: false,
  define: {
    freezeTableName: true
  }
}

const sequelize = new Sequelize(`postgres://${USER}:${PSWD}@${HOST}:${PORT}/${DB}`, opts);
const {
  User,
  Patient
} = initModels(sequelize);

sequelize.sync().then(() => { console.log("Tabelle up!"); });



app.locals.models = {
  User,
  Patient

};

app.use("/session", sessionRoute)



app.listen(8000, () => {
  console.log("Su wikipedia, ma non per le chansons");
});



