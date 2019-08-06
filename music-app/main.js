const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const mongoose = require("mongoose");
const music = require("./modules/music");

mongoose.connect("mongodb://localhost/RealShuffle", {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
  console.log("Connected");
});

const app = http.createServer((request, response) => {
  const requestUrl = request.url;
  const query = url.parse(requestUrl, true).query;
  if (requestUrl === "/") {
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + "/index.html"));
  } else {
    if (requestUrl === "/favicon.ico") {
      return response.writeHead(404);
    } else if (requestUrl.startsWith("/next")) {
      music.findOne({ id: Number(query.id) + 1 }, function(err, next) {
        response.writeHead(200);
        response.end(JSON.stringify(next));
      });
    } else if (requestUrl.startsWith("/prev")) {
      music.findOne({ id: Number(query.id) - 1 }, function(err, next) {
        response.writeHead(200);
        response.end(JSON.stringify(next));
      });
    } else {
      response.end(fs.readFileSync(__dirname + requestUrl));
    }
  }
});

app.listen(3000);
