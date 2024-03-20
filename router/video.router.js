const axios = require("axios");
module.exports = function (app, api) {
  const videoController = require("../controller/video.controller.js");

  // get latest videos from tiktok and save to db
  app.get("/fetch", videoController.fetch(api));

  app.get("/getVideos", videoController.getVideosByCategory);

  app.get("/", (req, res) => {
    res.render("mainpage");
  });

  app.post("/play", (req, res) => {
    console.log(req.body);
    req.session.playData = req.body;
    res.json({ redirectUrl: "/play" });
  });

  app.get("/play", async (req, res) => {
    if (!req.session.playData) {
      return res.status(400).send("No video data found in session");
    }

    const playData = req.session.playData;
    const videoUrl = playData.playUrl;
    const cookie = playData.cookie;

    try {
      const response = await axios.get(videoUrl, {
        responseType: "stream",
        headers: {
          Cookie: cookie,
          Origin: "https://www.tiktok.com",
          Referer: "https://www.tiktok.com/",
        },
      });

      res.setHeader("Content-Type", "video/mp4");

      response.data.pipe(res);
    } catch (error) {
      console.error("Error streaming video: ", error);
      res.status(500).send("Failed to stream video");
    }
  });
};
