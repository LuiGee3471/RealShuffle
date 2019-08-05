const http = require("http");
const fs = require("fs");
const url = require("url");
const mongoose = require("mongoose");
const music = require("./modules/music");

mongoose.connect("mongodb://localhost/RealShuffle", {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
  console.log("Connected");
  music.find(function(err, musics) {
    console.log(musics);
  });
});

const app = http.createServer((request, response) => {
  const requestUrl = request.url;
  response.writeHead(200);
  response.end();
});

app.listen(3000);
