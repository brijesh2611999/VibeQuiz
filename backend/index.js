
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let votes = {
  chill: 0,
  chaotic: 0,
  feral: 0,
  zen: 0,
};

io.on("connection", (socket) => {
  socket.emit("voteUpdate", votes);

  socket.on("submitVote", (vibe) => {
    if (votes[vibe] !== undefined) {
      votes[vibe]++;
      io.emit("voteUpdate", votes);
    }
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
    