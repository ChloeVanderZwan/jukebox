-- TODO

-- Create the jukebox database schema

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Create playlists table
CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create tracks table
CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  duration_ms INTEGER NOT NULL
);

-- Create playlists_tracks junction table
CREATE TABLE playlists_tracks (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER NOT NULL,
  track_id INTEGER NOT NULL,
  
  -- Foreign key constraints with CASCADE DELETE
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,
  
  -- Unique constraint to ensure each track can only be in a playlist once
  UNIQUE(playlist_id, track_id)
);

-- Create index for better query performance
CREATE INDEX idx_playlists_tracks_playlist_id ON playlists_tracks(playlist_id);
CREATE INDEX idx_playlists_tracks_track_id ON playlists_tracks(track_id);
