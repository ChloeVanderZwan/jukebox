import express from "express";
import db from "#db/client";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /tracks - sends array of all tracks
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tracks ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /tracks/:id - sends track specified by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate that id is a number
  if (isNaN(id) || !Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Invalid track ID" });
  }

  try {
    const result = await db.query("SELECT * FROM tracks WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /tracks/:id/playlists - sends all playlists owned by the user that contain this track
router.get("/:id/playlists", authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Validate that id is a number
  if (isNaN(id) || !Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Invalid track ID" });
  }

  try {
    // Check if track exists
    const trackResult = await db.query("SELECT * FROM tracks WHERE id = $1", [
      id
    ]);

    if (trackResult.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }

    // Get playlists owned by the user that contain this track
    const playlistsResult = await db.query(
      `
      SELECT p.* 
      FROM playlists p 
      JOIN playlists_tracks pt ON p.id = pt.playlist_id 
      WHERE pt.track_id = $1 AND p.user_id = $2 
      ORDER BY p.id
    `,
      [id, req.user.userId]
    );

    res.json(playlistsResult.rows);
  } catch (error) {
    console.error("Error fetching track playlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
