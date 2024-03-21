module.exports = function (app) {
  const userController = require("../controller/user.controller.js");

  app.get("/register", (req, res) => {
    res.render("signup");
  });

  app.get("/login", (req, res) => {
    res.render("signin");
  });

  app.post("/register", userController.register);

  app.post("/login", userController.login);

  app.get("/user", userController.findAll);

  app.get("/user/:userId", userController.findOne);

  app.put("/user/:userId", userController.update);

  app.delete("/user/:userId", userController.delete);

  app.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
  });
};
