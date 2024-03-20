const axios = require("axios");
module.exports = function (app, api) {
  const liveController = require("../controller/live.controller.js");

  // get latest lives from tiktok and save to db
  app.get("/fetchLive", liveController.fetch(api));

  app.get("/getLives", liveController.getLivesByCategory);

};
