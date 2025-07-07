import app from "../../../../app.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET"],
  },
});

io.on("connection", () => {});

function sendNotification(notification) {
  io.emit("new_notification", notification);
}

export { server, sendNotification };
