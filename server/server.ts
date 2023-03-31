import * as dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database";
import path from "path";
import http from "http";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app = express();
new http.Server(app);

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Working!");
});

app.use("/api/users", userRouter);

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

app.listen(PORT, () => {
  console.log("\x1b[36m", `Server started on PORT ${PORT}`);
});
