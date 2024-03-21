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

exports.fetch = (api) => async (req, res) => {
  async function fetchAndSaveVideos(category, query, type) {
    try {
      let response;
      if (category === "explore") {
        response = await api.public.explore({ session_id: 0, country: "us" });
      } else if (category === "search") {
        response = await api.public.search({ category: "videos", query });
      } else {
        console.error("Unsupported category");
        return;
      }

      let videos = [];
      let header = response.json.$other?.videoLinkHeaders || {};
      let itemList = response.json.itemList || response.json.item_list || [];
      console.log(`${type} list length: ${itemList.length}`);

      itemList.forEach((item) => {
        let video = createVideoObj(item, type);
        video.videoLinkHeaders = header;
        videos.push(video);
      });
      console.log(`processed videos list length: ${videos.length}`);

      const docs = await Video.insertMany(videos);
      console.log(`${docs.length} ${type} videos saved successfully!`);
    } catch (err) {
      console.error(err?.statusCode, err?.message, err?.json);
      throw err;
    }
  }

  const tasks = [
    fetchAndSaveVideos("explore", null, "trending"),
    fetchAndSaveVideos("search", "sport", "sport"),
    fetchAndSaveVideos("search", "funny", "funny"),
    fetchAndSaveVideos("search", "cat", "cat"),
  ];

  try {
    await Promise.all(tasks);
    // res.send();
    res.json({ msg: "All videos fetched and saved successfully!" });
  } catch (error) {
    res.status(500).json({ msg: "An error occurred while fetching videos." });
  }
};

exports.getVideosByCategory = function (req, res) {
  let category = req.query.category;
  let count = parseInt(req.query.count, 10) || 10;

  if (!category) {
    Video.find({})
      .then((videos) => {
        res.json(videos);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "server error" });
      });
  } else {
    Video.find({ category: category })
      .limit(count)
      .then((videos) => {
        res.json(videos);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "server error" });
      });
  }
};

exports.getAllTrending2 = function () {
  return Video.find({})
    .exec()
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
