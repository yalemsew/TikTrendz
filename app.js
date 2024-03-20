require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const TikAPI = require("tikapi").default;
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const chatController = require("./controller/chatroom.controller");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./views")));
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// Session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// Database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
});

// MongoDB
mongoose
  .connect(process.env.MONGODB_RUL, {})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error: " + err));

// MongoDB Error Listener
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// chatroom io
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", async ({ roomId, userName, message }) => {
    try {
      const savedMessage = await chatController.sendMessage({
        roomId,
        userName,
        message,
      });
      io.to(roomId).emit("receiveMessage", savedMessage);
    } catch (err) {
      console.error("Error processing message: ", err);
    }
  });

  socket.on("requestChatHistory", async (roomId) => {
    try {
      console.log('history')
      const messages = await chatController.getMessages(roomId);
      socket.emit("chatHistory", messages); 
    } catch (err) {
      console.error("Error fetching chat history: ", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Check DB Connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// Tik API
const api = TikAPI(process.env.TIKAPI_KEY);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Routes
require("./router/app.router")(app);
require("./router/user.router")(app);
require("./router/video.router")(app, api);
require("./router/live.router")(app, api);
