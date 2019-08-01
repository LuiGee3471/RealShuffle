const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, description, control) {
  return `
  <!doctype html>
  <html>
  <head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
  </head>
  <body>
  <h1><a href="/">WEB</a></h1>
  ${list}
  ${control}
  <h2>${title}</h2>
  <p>${description}</p>
  </body>
  </html>
  `;
}

function templateList(files) {
  let list = "<ul>";
  files.forEach(file => {
    list = list + `<li><a href="/?id=${file}">${file}</a></li>`;
  });
  list = list + "</ul>";

  return list;
}

const app = http.createServer(function(request, response) {
  let requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const pathname = url.parse(requestUrl, true).pathname;
  let title = queryData.id;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./text", (err, files) => {
        const list = templateList(files);
        let title = "Welcome";
        let description = "Hello, Node.js";
        const template = templateHTML(
          title,
          list,
          description,
          `<a href="/create">Create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./text", (err, files) => {
        const list = templateList(files);
        fs.readFile(`text/${queryData.id}`, "utf-8", (err, description) => {
          if (err) {
            console.log(err.message);
          }
          const template = templateHTML(
            title,
            list,
            description,
            `<a href="/create">Create</a> <a href="/update?id=${title}">update</a>
            <form action="/delete-process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            `
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./text", (err, files) => {
      const list = templateList(files);
      let title = "WEB - create";
      let description = `
        <form action="/create-process" method="post">
          <div><input type="text" name="title" placeholder="title"></div>
          <div><textarea name="description" placeholder="description"></textarea></div>
          <input type="submit" value="전송">
        </form>
      `;
      const template = templateHTML(title, list, description, "");
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create-process") {
    var body = "";
    request.on("data", data => {
      body = body + data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`./text/${title}`, description, "utf-8", err => {
        if (err) {
          console.log("Failed!");
          return;
        }
        response.writeHead(302, {
          Location: `/?id=${title}`
        });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./text", (err, files) => {
      const list = templateList(files);
      fs.readFile(`text/${queryData.id}`, "utf-8", (err, description) => {
        if (err) {
          console.log(err.message);
        }
        const template = templateHTML(
          title,
          list,
          `
          <form action="/update-process" method="post">
            <input type="hidden" name="id" value="${title}">
            <div><input type="text" name="title" placeholder="title" value=${title}></div>
            <div><textarea name="description" placeholder="description">${description}</textarea></div>
            <input type="submit" value="전송">
          </form>
          `,
          `<a href="/create">Create</a> <a href="/update?id=${title}">update</a>
          `
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/update-process") {
    var body = "";
    request.on("data", data => {
      body = body + data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;
      fs.rename(`./text/${id}`, `./text/${title}`, err => {
        fs.writeFile(`./text/${title}`, description, err => {
          response.writeHead(302, {
            Location: `/?id=${title}`
          });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete-process") {
    var body = "";
    request.on("data", data => {
      body = body + data;
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;
      fs.unlink(`./text/${id}`, err => {
        response.writeHead(302, {
          Location: `/`
        });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3060);
