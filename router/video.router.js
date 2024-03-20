const axios = require("axios");
module.exports = function (app, api) {
  const videoController = require("../controller/video.controller.js");

  // get latest videos from tiktok and save to db
  app.get("/fetch", videoController.fetch(api));

  app.get("/getVideos", videoController.getVideosByCategory);
  app.get("/getVideoslist", videoController.getAllTrending2);


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


  //Nahom code ***************************************************

  app.get("/hashtag", (req, res) => {
    res.render("hashtag");
  })

  app.get("/wordcloud", (req, res) => {
    videoController.getAllTrending2()
      .then((trendingVideos) => {
        if (!trendingVideos) {
          return res.status(404).json({ error: "Trending videos not found" });
        }
  
        // Sorting the videos
        trendingVideos.sort((a, b) => parseInt(b.authorStats.diggCount) - parseInt(a.authorStats.diggCount));

        let hashtagMap = {};

        trendingVideos.forEach(video => {
          let desc = video.desc;
          if (desc != undefined) {
            let words = desc.split(" ");

            words.forEach(word => {
              if (word.charAt(0) === "#") {
                let hashtag = word.substring(1); // Remove '#' from the hashtag
                if (hashtag in hashtagMap) {
                  hashtagMap[hashtag] += 1;
                } else {
                  hashtagMap[hashtag] = 1;
                }
              }
            });
          }
        });

        const popularHashtags = Object.entries(hashtagMap)
          .sort((a, b) => b[1] - a[1]) // sort by frequency in descending order
          .slice(0, 20); // get top 20 popular hashtags

        //console.log(popularHashtags);

        return res.json(popularHashtags.map(([name, count]) => name)); // Send the sorted hashtags as response
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "Error getting trending videos" });
      });
    });

    app.post('/api/word', (req, res) => {
      const clickedWord = req.body.word;
      
      videoController.getAllTrending2()
        .then((trendingVideos) => {
          if (!trendingVideos) {
            return res.status(404).json({ error: "Trending videos not found" });
          }
    
          let person = [];
    
          for (let i = 0; i < trendingVideos.length; i++) {
            let desc = trendingVideos[i].desc;
            if (desc != undefined) {
              let words = desc.split(" ");
    
              for (let j = 0; j < words.length; j++) {
                if (words[j].charAt(0) == "#" && words[j] === `#${clickedWord}`) {
                  person.push(trendingVideos[i]);
                  break; // Exit the inner loop once the word is found
                }
              }
            }
          }
    
          res.json({ person: person });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "Error getting trending videos" });
        });
    });

    app.get("/videolist", (req,res)=>{
      res.render("videolist");
    })
};
