require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const TikAPI = require("tikapi").default;
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require('express-session');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./views")));
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// Session
app.use(session({
  secret: '2MI84oR5iibzBsydI54RvQ2BYbL6Yyk4',
  resave: false,
  saveUninitialized: true,
}));

// Database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
});

// MongoDB
mongoose
  .connect(process.env.MONGODB_RUL, {})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error: " + err));

// Check DB Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// Tik API
const api = TikAPI(process.env.TIKAPI_KEY);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Routes
require("./router/app.router")(app);
require("./router/user.router")(app);
require("./router/video.router")(app, api);
