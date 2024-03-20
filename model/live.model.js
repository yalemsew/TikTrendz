const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define sub-schema for cover images
const ImageSchema = new Schema({
  urlList: [String],
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
  liveStreamId: { type: String },
  title: String,
  cover: ImageSchema,
  streamUrl: String,
  author: AuthorSchema,
  category: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LiveStream", LiveStreamSchema);
