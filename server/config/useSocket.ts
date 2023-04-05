import { Server } from "http";
import { Server as SocketServer } from "socket.io";

let users: { socketId: string; userId: string }[] = [];

const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

const NEW_MESSAGE_EVENT = "newMessageEvent";
const USER_TYPING_EVENT = "userTypingEvent";

export const useSocket = (server: Server) => {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("CONNECTED", socket.id);
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
    });

    socket.on("sendMessage", (data) => {
      const { convo_id, user_id, otherUser_id, message } = data;
      const user = getUser(otherUser_id);
      console.log(user, data);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          createdAt: Date.now(),
          author: user_id,
          content: message,
          convo_id,
        });
      }
    });

    const { roomId } = socket.handshake.query;
    socket.join(roomId as string);

    socket.on(NEW_MESSAGE_EVENT, (data) => {
      io.in(roomId as string).emit(NEW_MESSAGE_EVENT, data);
    });

    socket.on(USER_TYPING_EVENT, (data) => {
      io.in(roomId as string).emit(USER_TYPING_EVENT, data);
    });

    socket.on("disconnect", () => {
      console.log("DISCONNECTED", socket.id);
      socket.leave(roomId as string);
      removeUser(socket.id);
    });

    socket.on("error", (err) => console.log("error:", err));
  });

  return io;
};

// const io = require("socket.io")(http, {
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Origin": req.headers.origin,
//       "Access-Control-Allow-Credentials": true,
//     };
//     res.writeHead(200, headers);
//     res.end();
//   },
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["content-type"],
//   },
// })
