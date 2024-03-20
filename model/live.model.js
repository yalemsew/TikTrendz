const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define sub-schema for cover images
const ImageSchema = new Schema({
  avgColor: String,
  uri: String,
  urlList: [String],
});

// Define sub-schema for stream URLs
const StreamUrlSchema = new Schema({
  flv: {
    HD1: String,
    SD1: String,
    SD2: String,
  },
  rtmp: String,
});

// Define sub-schema for author information
const AuthorSchema = new Schema({
  userId: String,
  displayName: String,
  bioDescription: String,
  avatar: {
    large: String,
    medium: String,
    thumb: String,
  },
  followerCount: Number,
  followingCount: Number,
});

// Main live stream schema
const LiveStreamSchema = new Schema({
  liveStreamId: { type: String, required: true, unique: true },
  title: String,
  cover: ImageSchema,
  streamUrls: StreamUrlSchema,
  author: AuthorSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LiveStream", LiveStreamSchema);