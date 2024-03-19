const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HashtagSchema = new Schema({
    hashtagId: String,
    nahashtagNameme: String
  });

const VideoSchema = new Schema({
  videoLinkHeaders: {
    Cookie: String,
    Origin: String,
    Referer: String,
  },
  author: {
    id: String,
    avatarLarger: String,
    nickname: String,
    openFavorite: Boolean,
    privateAccount: Boolean,
    signature: String,
    uniqueId: String,
  },
  authorStats: {
    diggCount: Number,
    followerCount: Number,
    followingCount: Number,
    friendCount: Number,
    heart: Number,
    heartCount: Number,
    videoCount: Number,
  },
  createTime: Number,
  desc: String,
  id: { type: String },
  stats: {
    collectCount: Number,
    commentCount: Number,
    diggCount: Number,
    playCount: Number,
    shareCount: Number,
  },
  textExtra: [HashtagSchema],
  downloadAddr: String,
});

module.exports = mongoose.model('Video', VideoSchema);
