module.exports = function (app, api) {
  const videoController = require("../controller/video.controller.js");

  // get latest videos from tiktok and save to db
  app.get("/fetch", videoController.fetch(api));

  app.get("/trending", videoController.getAllTrending);

  app.get("/", (req, res) => {
    res.render("mainpage");
  });

  app.post("/play", (req, res) => {
    
  })

  app.get("/play", (req, res) => {
    res.render("videoPlay");
  });
};
