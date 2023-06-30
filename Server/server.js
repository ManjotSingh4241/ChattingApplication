console.log("server loaded");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
const io = require("socket.io")(http);
var PORT = process.env.PORT || 8080;
var path = require("path");

app.use(express.static(path.join(__dirname, "../"))); 

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("user:", name)
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`Express http server listening on port ${PORT}`);
});