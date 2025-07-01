import express from "express";
import tracksRouter from "./routes/tracks.js";
import playlistsRouter from "./routes/playlists.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

export default app;
