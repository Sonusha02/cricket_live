import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
// import http from "http";
// import { Server as socketIo } from "socket.io";

import { Server } from "socket.io";
import axios from "axios";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import betRoutes from "./routes/betRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";


const app = express();
// const server = http.createServer(app);
// const io = new socketIo(server, { cors: { origin: "*" } });

// Create WebSocket server
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // Adjust for frontend domain
});

// Fetch live match data from a free API
const fetchLiveMatches = async () => {
  try {
    const response = await axios.get("https://cricket-api.vercel.app/matches");
    const matches = response.data; // Ensure the API structure matches
    io.emit("liveMatches", matches); // Broadcast to all clients
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
};

// Fetch match data every 10 seconds
setInterval(fetchLiveMatches, 10000);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("message", "Connected to live cricket updates!");
  socket.on("disconnect", () => console.log("User disconnected"));
});

app.use(cors());
app.use(express.json());
app.use(helmet()); // Security headers

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);

// // WebSocket for real-time betting
// io.on("connection", (socket) => {
//   console.log("New client connected");
//   socket.on("disconnect", () => console.log("Client disconnected"));
// });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));