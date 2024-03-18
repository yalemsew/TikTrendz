require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const TikAPI = require("tikapi").default;
const mongoose = require("mongoose");

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

// Routes
require("./router/app.router")(app);
require("./router/user.router")(app);

// Tik API
const api = TikAPI(process.env.TIKAPI_KEY);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);

  (async function () {
    try {
      let response = await api.public.explore({
        session_id: 0,
        country: "br",
      });
      console.log(response.json);
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();
});
