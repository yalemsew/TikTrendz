const mongoose = require("mongoose");
const Video = require("../model/video.model.js");
const uuid = require("node-uuid");

function createVideoObj(item, category) {
  let videoObj = {
    videoLinkHeaders: {},
    author: {
      id: item?.author?.id,
      avatarLarger: item?.author?.avatarLarger,
      nickname: item?.author?.nickname,
      openFavorite: item?.author?.openFavorite,
      privateAccount: item?.author?.privateAccount,
      signature: item?.author?.signature,
      uniqueId: item?.author?.uniqueId,
    },
    authorStats: item?.authorStats,
    createTime: item?.createTime,
    desc: item?.desc,
    id: item?.id,
    stats: item.stats,
    textExtra: [],
    downloadAddr: item?.video?.downloadAddr,
    reflowCover: item?.video?.reflowCover,
    category: category,
  };

  if (Array.isArray(item.textExtra)) {
    item.textExtra.forEach((tag) => {
      let hashTag = {
        hashtagId: tag.hashtagId,
        hashtagName: tag.hashtagName,
      };
      videoObj.textExtra.push(hashTag);
    });
  }

  return videoObj;
}

exports.fetch = (api) => (req, res) => {
  // fetch trending
  api.public
    .explore({
      session_id: 0,
      country: "us",
    })
    .then((response) => {
      let videos = [];
      let header = {};
      header = response.json.$other.videoLinkHeaders;
      if (Array.isArray(response.json.itemList)) {
        response.json.itemList.forEach((item) => {
          let video = createVideoObj(item, "trending");
          video.videoLinkHeaders = header;
          videos.push(video);
        });
      }

      // Save the new videos to the database
      Video.insertMany(videos)
        .then((docs) => {
          console.log(docs.length + " trending videos saved successfully!");
          // res.send("fetched successfully!");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.log(err?.statusCode, err?.message, err?.json);
    });

  // fetch sport
  api.public
    .search({
      category: "videos",
      query: "sport",
    })
    .then((response) => {
      // res.json(response.json);
      let videos = [];
      let header = {};
      header = response.json?.$other?.videoLinkHeaders;
      if (Array.isArray(response.json.item_list)) {
        console.log("sport list length: " + response.json.item_list.length);
        response.json.item_list.forEach((item) => {
          let video = createVideoObj(item, "sport");
          video.videoLinkHeaders = header;
          videos.push(video);
        });
        console.log("processed vodeos list length: " + videos.length);
      }

      // Save the new videos to the database
      Video.insertMany(videos)
        .then((docs) => {
          console.log(docs.length + " sport videos saved successfully!");
          res.send("fetched successfully!");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.log(err?.statusCode, err?.message, err?.json);
    });

  // fetch funny
  api.public
    .search({
      category: "videos",
      query: "funny",
    })
    .then((response) => {
      // res.json(response.json);
      let videos = [];
      let header = {};
      header = response.json?.$other?.videoLinkHeaders;
      if (Array.isArray(response.json.item_list)) {
        console.log("funny list length: " + response.json.item_list.length);
        response.json.item_list.forEach((item) => {
          let video = createVideoObj(item, "funny");
          video.videoLinkHeaders = header;
          videos.push(video);
        });
        console.log("processed vodeos list length: " + videos.length);
      }

      // Save the new videos to the database
      Video.insertMany(videos)
        .then((docs) => {
          console.log(docs.length + " cat videos saved successfully!");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.log(err?.statusCode, err?.message, err?.json);
    });

  // fetch cat
  api.public
    .search({
      category: "videos",
      query: "cat",
    })
    .then((response) => {
      // res.json(response.json);
      let videos = [];
      let header = {};
      header = response.json?.$other?.videoLinkHeaders;
      if (Array.isArray(response.json.item_list)) {
        console.log("cat list length: " + response.json.item_list.length);
        response.json.item_list.forEach((item) => {
          let video = createVideoObj(item, "cat");
          video.videoLinkHeaders = header;
          videos.push(video);
        });
        console.log("processed vodeos list length: " + videos.length);
      }

      // Save the new videos to the database
      Video.insertMany(videos)
        .then((docs) => {
          console.log(docs.length + " cat videos saved successfully!");
          res.send("fetched successfully!");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.log(err?.statusCode, err?.message, err?.json);
    });
};

exports.getVideosByCategory = function (req, res) {
  let category = req.query.category;
  let count = parseInt(req.query.count, 10) || 10;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  Video.find({ category: category })
    .limit(count)
    .then((videos) => {
      res.json(videos);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "server error" });
    });
};

exports.getAllTrending2 = function () {
  return Video.find({}).exec()
    .then((trendingVideos) => {
      if (!trendingVideos) {
        return Promise.reject(new Error("Trending videos not found"));
      }

      return trendingVideos;
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject(new Error("Error getting trending videos"));
    });
  };
