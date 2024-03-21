module.exports = function (app) {
  const userController = require("../controller/user.controller.js");
  const { authenticateToken, requireRoles } = require("../middleware/auth.js");

  // app.post("/user", userController.create);

  app.get("/user", userController.findAll);

  app.get("/unauthorized", (req, res) => {
    res.render("unauthorized");
  });

  app.get("/user/:userId", userController.findOne);

  app.put("/user/:userId", userController.update);

  app.delete("/user/:userId", userController.delete);

  app.get("/chat", (req, res) => {
    res.render("chatRoom");
  });

  app.get(
    "/admin",
    authenticateToken,
    requireRoles(["it", "operation"]),
    (req, res) => {
      res.render("adminPage");
    }
  );
};
