import * as dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database";
import path from "path";
import http from "http";
import cors from "cors";
import { useSocket } from "./config/useSocket";
import { useRoutes } from "./config/useRoutes";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();
useSocket(server);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Working!");
});

useRoutes(app);

// Serve Frontend
if (process.env.NODE_ENV === "production") {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Something is wrong :)" });
  });
}

server.listen(PORT, () => {
  console.log("\x1b[36m", `Server started on PORT ${PORT}`);
});
