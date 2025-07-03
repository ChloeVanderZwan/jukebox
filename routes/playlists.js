import express from "express";
import db from "#db/client";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all playlist routes
router.use(authenticateToken);

// Helper function to validate ID parameter
const validateId = (id) => {
  return !isNaN(id) && Number.isInteger(Number(id));
};

// GET /playlists - sends array of all playlists owned by the user
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM playlists WHERE user_id = $1 ORDER BY id",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /playlists - creates a new playlist owned by the user
router.post("/", async (req, res) => {
  const { name, description } = req.body || {};

  // Validate request body
  if (!req.body || !name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO playlists (name, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /playlists/:id - sends playlist specified by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate that id is a number
  if (!validateId(id)) {
    return res.status(400).json({ error: "Invalid playlist ID" });
  }

  try {
    const result = await db.query("SELECT * FROM playlists WHERE id = $1", [
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const playlist = result.rows[0];

    // Check if user owns the playlist
    if (playlist.user_id !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /playlists/:id/tracks - sends all tracks in the playlist
router.get("/:id/tracks", async (req, res) => {
  const { id } = req.params;

  // Validate that id is a number
  if (!validateId(id)) {
    return res.status(400).json({ error: "Invalid playlist ID" });
  }

  try {
    // First check if playlist exists
    const playlistResult = await db.query(
      "SELECT * FROM playlists WHERE id = $1",
      [id]
    );

    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const playlist = playlistResult.rows[0];

    // Check if user owns the playlist
    if (playlist.user_id !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get tracks in the playlist
    const tracksResult = await db.query(
      `
      SELECT t.* 
      FROM tracks t 
      JOIN playlists_tracks pt ON t.id = pt.track_id 
      WHERE pt.playlist_id = $1 
      ORDER BY t.id
    `,
      [id]
    );

    res.json(tracksResult.rows);
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /playlists/:id/tracks - adds a new track to the playlist
router.post("/:id/tracks", async (req, res) => {
  const { id } = req.params;
  const { trackId } = req.body || {};

  // Validate playlist id
  if (!validateId(id)) {
    return res.status(400).json({ error: "Invalid playlist ID" });
  }

  // Validate request body
  if (!req.body || trackId === undefined) {
    return res.status(400).json({ error: "trackId is required" });
  }

  // Validate trackId is a number
  if (!validateId(trackId)) {
    return res.status(400).json({ error: "Invalid track ID" });
  }

  try {
    // Check if playlist exists
    const playlistResult = await db.query(
      "SELECT * FROM playlists WHERE id = $1",
      [id]
    );

    if (playlistResult.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Check if track exists
    const trackResult = await db.query("SELECT * FROM tracks WHERE id = $1", [
      trackId
    ]);

    if (trackResult.rows.length === 0) {
      return res.status(400).json({ error: "Track not found" });
    }

    // Check if track is already in playlist
    const existingResult = await db.query(
      "SELECT * FROM playlists_tracks WHERE playlist_id = $1 AND track_id = $2",
      [id, trackId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: "Track is already in playlist" });
    }

    // Add track to playlist
    const result = await db.query(
      "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2) RETURNING *",
      [id, trackId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
