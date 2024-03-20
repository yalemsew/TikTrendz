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

  //index2 will be reroute from the main once the cloud word is clicked
  // app.get("/index2", (req, res) => {
  //   const hashtag = req.query.item;
  //   videoController
  //     .getAllTrending()
  //     .then((trendingVideos) => {
  //       if (!trendingVideos) {
  //         return res.status(404).json({ error: "Trending videos not found" });
  //       }

  //       let filteredData = filterByHashtag(trendingVideos, hashtag);

  //       const hashtags = filteredData.map((video) => {
  //         return {
  //           id: video.id,
  //           desc: video.desc,
  //           likes: video.likes,
  //         };
  //       });

  //       console.log(hashtags);
  //       return res.render("_hashTag", hashtags); //rendering the page with the filtered data
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return res.status(500).json({ error: "Error getting trending videos" });
  //     });

  //   //function for filtering videos by hashtag

  //   function filterByHashtag(data, hashtag) {
  //     return data.filter((item) => {
  //       const hashtags = item.desc
  //         .split(" ")
  //         .filter((tag) => tag.startsWith("#"));
  //       return hashtags.includes(`#${hashtag}`);
  //     });
  //   }
  // });
};
