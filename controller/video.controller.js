const mongoose = require("mongoose");
const Video = require("../model/video.model.js");

let videos = [];

let videoObj = {
  videoLinkHeaders: {
    Cookie: "",
    Origin: "",
    Referer: "",
  },
  author: {
    id: "",
    avatarLarger: "",
    nickname: "",
    openFavorite: false,
    privateAccount: false,
    signature: "",
    uniqueId: "",
  },
  authorStats: {
    diggCount: null,
    followerCount: null,
    followingCount: null,
    friendCount: null,
    heart: null,
    heartCount: null,
    videoCount: null,
  },
  createTime: null,
  desc: "",
  id: "",
  stats: {
    collectCount: null,
    commentCount: null,
    diggCount: null,
    playCount: null,
    shareCount: null,
  },
  textExtra: [],
  downloadAddr: "",
  reflowCover: "",
};
let originalResJson = {};

exports.fetch = (api) => (req, res) => {
  // fetch trending
  api.public
    .explore({
      session_id: 0,
      country: "us",
    })
    .then((response) => {
      originalResJson = response.json;

      videos = [];

      if (Array.isArray(originalResJson.itemList)) {
        originalResJson.itemList.forEach((item) => {
          let videoObj = {
            videoLinkHeaders: originalResJson["$other"].videoLinkHeaders,
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

          videos.push(videoObj);
        });
      }

      // Save the new videos to the database
      Video.insertMany(videos)
        .then((docs) => {
          console.log(docs.length + " videos saved successfully!");
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

exports.getAllTrending = function (req, res) {
  Video.find({})
    .then((videos) => {
      // console.log("All videos:", videos);
      res.json(videos);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "server error" });
    });
};
