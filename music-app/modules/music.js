const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    artist: String,
    time: Number,
    cover: String,
    audio: String,
    played: Array
  },
  { collection: "playlist" }
);

module.exports = mongoose.model("music", musicSchema);
