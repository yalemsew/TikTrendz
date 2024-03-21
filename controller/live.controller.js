const mongoose = require("mongoose");
const Live = require("../model/live.model.js");
const uuid = require("node-uuid");
require("dotenv").config();

function createLiveStreamObj(item, category) {
  let liveStreamObj = {
    liveStreamId: item.id_str,
    title: item.title,
    cover: {
      urlList: item.cover?.url_list || [],
    },
    streamUrl: item.stream_url.live_core_sdk_data.pull_data.stream_data,
    author: {
      userId: item.owner?.id_str || "",
      displayName: item.owner?.nickname || "",
      bioDescription: item.owner?.bio_description || "",
      avatar: {
        large: item.owner?.avatar_large?.url_list?.[0] || "",
        medium: item.owner?.avatar_medium?.url_list?.[0] || "",
        thumb: item.owner?.avatar_thumb?.url_list?.[0] || "",
      },
      followerCount: item.owner?.follow_info?.follower_count || 0,
      followingCount: item.owner?.follow_info?.following_count || 0,
    },
    createdAt: new Date(),
    category: category,
  };

  return liveStreamObj;
}

exports.fetch = (api) => (req, res) => {
  const User = new api.user({
    accountKey: process.env.TIKAPI_ACCOUNT_KEY,
  });
  // fetch game livestreaming
  let category = "game";
  (async function () {
    try {
      let response = await User.live.search({
        query: category,
      });
      let liveStreams = [];
      let header = {};
      header = response.json["$other"].videoLinkHeaders;
      //   console.log(response.json);

      if (Array.isArray(response.json.data)) {
        response.json.data.forEach((item) => {
          let liveStream = createLiveStreamObj(item.live_info, category);
          liveStream.videoLinkHeaders = header;
          liveStreams.push(liveStream);
        });
      }

      // Save the new livestreams to the database
      Live.insertMany(liveStreams)
        .then((docs) => {
          console.log(
            docs.length + " " + category + " livestreams saved successfully!"
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();

  // programming

  (async function () {
    try {
      let category = "programming";
      let response = await User.live.search({
        query: category,
      });
      let liveStreams = [];
      let header = {};
      header = response.json["$other"].videoLinkHeaders;
      //   console.log(response.json);

      if (Array.isArray(response.json.data)) {
        response.json.data.forEach((item) => {
          let liveStream = createLiveStreamObj(item.live_info, category);
          liveStream.videoLinkHeaders = header;
          liveStreams.push(liveStream);
        });
      }

      // Save the new livestreams to the database
      Live.insertMany(liveStreams)
        .then((docs) => {
          console.log(
            docs.length + " " + category + " livestreams saved successfully!"
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();
  // outdoor

  (async function () {
    try {
      let category = "outdoor";
      let response = await User.live.search({
        query: category,
      });
      let liveStreams = [];
      let header = {};
      header = response.json["$other"].videoLinkHeaders;
      //   console.log(response.json);

      if (Array.isArray(response.json.data)) {
        response.json.data.forEach((item) => {
          let liveStream = createLiveStreamObj(item.live_info, category);
          liveStream.videoLinkHeaders = header;
          liveStreams.push(liveStream);
        });
      }

      // Save the new livestreams to the database
      Live.insertMany(liveStreams)
        .then((docs) => {
          console.log(
            docs.length + " " + category + " livestreams saved successfully!"
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();
};

exports.getLivesByCategory = function (req, res) {
  let category = req.query.category;
  let count = parseInt(req.query.count, 10) || 10;

  if (!category) {
    Live.find({})
      .then((livestreams) => {
        res.json(livestreams);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "server error" });
      });
  } else {
    Live.find({ category: category })
      .limit(count)
      .then((livestreams) => {
        res.json(livestreams);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "server error" });
      });
  }
};
