const mongoose = require("mongoose");
const Live = require("../model/live.model.js");
const uuid = require("node-uuid");
require("dotenv").config();

function createLiveStreamObj(item, category) {
  let liveStreamObj = {
    liveStreamId: item.id_str,
    title: item.title,
    cover: {
      avgColor: item.cover.avg_color,
      uri: item.cover.uri,
      urlList: item.cover.url_list,
    },
    streamUrls: {
      flv: {
        HD1: item.stream_url.flv_pull_url.HD1,
        SD1: item.stream_url.flv_pull_url.SD1,
        SD2: item.stream_url.flv_pull_url.SD2,
      },
      rtmp: item.stream_url.rtmp_pull_url,
    },
    author: {
      userId: item.owner.id_str,
      displayName: item.owner.nickname,
      bioDescription: item.owner.bio_description,
      avatar: {
        large: item.owner.avatar_large.url_list[0],
        medium: item.owner.avatar_medium.url_list[0],
        thumb: item.owner.avatar_thumb.url_list[0],
      },
      followerCount: item.owner.follow_info.follower_count,
      followingCount: item.owner.follow_info.following_count,
    },
    createdAt: new Date(), // Assuming you want to set the current date as the creation date
    // updatedAt is automatically set by Mongoose to the current date by default
    category: category, // Assuming you have a category field similar to the video object
  };

  return liveStreamObj;
}

exports.fetch = (api) => (req, res) => {
  const User = new api.user({
    accountKey: process.env.TIKAPI_ACCOUNT_KEY,
  });
  // fetch game livestreaming
  (async function () {
    try {
      let response = await User.live.search({
        query: "game",
      });
      console.log(response.json);
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();

  // fetch programming livestreaming
  (async function () {
    try {
      let response = await User.live.search({
        query: "programming",
      });
      console.log(response.json);
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();

  // fetch outdoor livestreaming
  (async function () {
    try {
      let response = await User.live.search({
        query: "outdoor",
      });
      console.log(response.json);
    } catch (err) {
      console.log(err?.statusCode, err?.message, err?.json);
    }
  })();

};

exports.getLivesByCategory = function (req, res) {};
