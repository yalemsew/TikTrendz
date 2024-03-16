require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
});

// Check DB Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// Routes
require("./router/app.router")(app);
require("./router/user.router")(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
