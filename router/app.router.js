module.exports = function (app) {
  const userController = require("../controller/user.controller.js");

  app.post("/user", userController.create);

  app.get("/user", userController.findAll);

  app.get("/user/:userId", userController.findOne);

  app.put("/user/:userId", userController.update);

  app.delete("/user/:userId", userController.delete);

  app.get("/chat", (req, res) => {
    res.render("chatRoom");
  });
};
