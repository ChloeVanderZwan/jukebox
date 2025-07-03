import db from "#db/client";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Clear existing data
  await db.query("DELETE FROM playlists_tracks");
  await db.query("DELETE FROM playlists");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM tracks");

  // Reset sequences
  await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
  await db.query("ALTER SEQUENCE playlists_id_seq RESTART WITH 1");
  await db.query("ALTER SEQUENCE tracks_id_seq RESTART WITH 1");
  await db.query("ALTER SEQUENCE playlists_tracks_id_seq RESTART WITH 1");

  // Insert users
  const users = [
    { username: "musiclover", password: "password123" },
    { username: "rockfan", password: "password456" }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      user.username,
      hashedPassword
    ]);
  }

  // Insert tracks
  const tracks = [
    { name: "Bohemian Rhapsody", duration_ms: 354000 },
    { name: "Hotel California", duration_ms: 391000 },
    { name: "Stairway to Heaven", duration_ms: 482000 },
    { name: "Imagine", duration_ms: 183000 },
    { name: "Hey Jude", duration_ms: 425000 },
    { name: "Smells Like Teen Spirit", duration_ms: 301000 },
    { name: "Like a Rolling Stone", duration_ms: 369000 },
    { name: "Yesterday", duration_ms: 125000 },
    { name: "Good Vibrations", duration_ms: 215000 },
    { name: "Johnny B. Goode", duration_ms: 158000 },
    { name: "What's Going On", duration_ms: 232000 },
    { name: "My Generation", duration_ms: 227000 },
    { name: "A Day in the Life", duration_ms: 337000 },
    { name: "Light My Fire", duration_ms: 287000 },
    { name: "I Want to Hold Your Hand", duration_ms: 145000 },
    { name: "Respect", duration_ms: 148000 },
    { name: "Goodbye Yellow Brick Road", duration_ms: 199000 },
    { name: "Bridge Over Troubled Water", duration_ms: 294000 },
    { name: "Let It Be", duration_ms: 243000 },
    { name: "Dream On", duration_ms: 263000 },
    { name: "Sweet Child O' Mine", duration_ms: 356000 },
    { name: "Billie Jean", duration_ms: 294000 },
    { name: "Purple Haze", duration_ms: 167000 },
    { name: "Comfortably Numb", duration_ms: 383000 }
  ];

  for (const track of tracks) {
    await db.query("INSERT INTO tracks (name, duration_ms) VALUES ($1, $2)", [
      track.name,
      track.duration_ms
    ]);
  }

  // Insert playlists
  const playlists = [
    {
      name: "Classic Rock Hits",
      description: "The best classic rock songs of all time",
      user_id: 1
    },
    {
      name: "Beatles Greatest",
      description: "Essential Beatles tracks",
      user_id: 1
    },
    {
      name: "90s Alternative",
      description: "Alternative rock from the 1990s",
      user_id: 1
    },
    {
      name: "Motown Classics",
      description: "Soul and R&B from Motown Records",
      user_id: 1
    },
    {
      name: "Guitar Heroes",
      description: "Songs featuring legendary guitar solos",
      user_id: 1
    },
    {
      name: "Summer Vibes",
      description: "Perfect songs for summer days",
      user_id: 2
    },
    {
      name: "Late Night Chill",
      description: "Relaxing music for late nights",
      user_id: 2
    },
    {
      name: "Road Trip Mix",
      description: "Great songs for long drives",
      user_id: 2
    },
    {
      name: "Party Starters",
      description: "High-energy songs to get the party going",
      user_id: 2
    },
    {
      name: "Acoustic Favorites",
      description: "Beautiful acoustic performances",
      user_id: 2
    }
  ];

  for (const playlist of playlists) {
    await db.query(
      "INSERT INTO playlists (name, description, user_id) VALUES ($1, $2, $3)",
      [playlist.name, playlist.description, playlist.user_id]
    );
  }

  // Insert playlist-track relationships
  const playlistTracks = [
    // Classic Rock Hits
    { playlist_id: 1, track_id: 1 }, // Bohemian Rhapsody
    { playlist_id: 1, track_id: 2 }, // Hotel California
    { playlist_id: 1, track_id: 3 }, // Stairway to Heaven
    { playlist_id: 1, track_id: 6 }, // Smells Like Teen Spirit
    { playlist_id: 1, track_id: 7 }, // Like a Rolling Stone

    // Beatles Greatest
    { playlist_id: 2, track_id: 4 }, // Imagine
    { playlist_id: 2, track_id: 5 }, // Hey Jude
    { playlist_id: 2, track_id: 8 }, // Yesterday
    { playlist_id: 2, track_id: 15 }, // I Want to Hold Your Hand
    { playlist_id: 2, track_id: 19 }, // Let It Be

    // 90s Alternative
    { playlist_id: 3, track_id: 6 }, // Smells Like Teen Spirit
    { playlist_id: 3, track_id: 21 }, // Sweet Child O' Mine
    { playlist_id: 3, track_id: 22 }, // Billie Jean
    { playlist_id: 3, track_id: 7 }, // Like a Rolling Stone
    { playlist_id: 3, track_id: 20 }, // Dream On

    // Motown Classics
    { playlist_id: 4, track_id: 11 }, // What's Going On
    { playlist_id: 4, track_id: 16 }, // Respect
    { playlist_id: 4, track_id: 9 }, // Good Vibrations
    { playlist_id: 4, track_id: 12 }, // My Generation
    { playlist_id: 4, track_id: 13 }, // A Day in the Life

    // Guitar Heroes
    { playlist_id: 5, track_id: 3 }, // Stairway to Heaven
    { playlist_id: 5, track_id: 10 }, // Johnny B. Goode
    { playlist_id: 5, track_id: 21 }, // Sweet Child O' Mine
    { playlist_id: 5, track_id: 24 }, // Purple Haze
    { playlist_id: 5, track_id: 23 }, // Comfortably Numb

    // Summer Vibes
    { playlist_id: 6, track_id: 2 }, // Hotel California
    { playlist_id: 6, track_id: 9 }, // Good Vibrations
    { playlist_id: 6, track_id: 17 }, // Goodbye Yellow Brick Road
    { playlist_id: 6, track_id: 14 }, // Light My Fire
    { playlist_id: 6, track_id: 11 }, // What's Going On

    // Late Night Chill
    { playlist_id: 7, track_id: 4 }, // Imagine
    { playlist_id: 7, track_id: 18 }, // Bridge Over Troubled Water
    { playlist_id: 7, track_id: 19 }, // Let It Be
    { playlist_id: 7, track_id: 8 }, // Yesterday
    { playlist_id: 7, track_id: 13 }, // A Day in the Life

    // Road Trip Mix
    { playlist_id: 8, track_id: 1 }, // Bohemian Rhapsody
    { playlist_id: 8, track_id: 2 }, // Hotel California
    { playlist_id: 8, track_id: 20 }, // Dream On
    { playlist_id: 8, track_id: 21 }, // Sweet Child O' Mine
    { playlist_id: 8, track_id: 3 }, // Stairway to Heaven

    // Party Starters
    { playlist_id: 9, track_id: 1 }, // Bohemian Rhapsody
    { playlist_id: 9, track_id: 6 }, // Smells Like Teen Spirit
    { playlist_id: 9, track_id: 22 }, // Billie Jean
    { playlist_id: 9, track_id: 24 }, // Purple Haze
    { playlist_id: 9, track_id: 10 }, // Johnny B. Goode

    // Acoustic Favorites
    { playlist_id: 10, track_id: 4 }, // Imagine
    { playlist_id: 10, track_id: 8 }, // Yesterday
    { playlist_id: 10, track_id: 18 }, // Bridge Over Troubled Water
    { playlist_id: 10, track_id: 19 }, // Let It Be
    { playlist_id: 10, track_id: 5 } // Hey Jude
  ];

  for (const pt of playlistTracks) {
    await db.query(
      "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2)",
      [pt.playlist_id, pt.track_id]
    );
  }

  console.log(`✅ Inserted ${users.length} users`);
  console.log(`✅ Inserted ${tracks.length} tracks`);
  console.log(`✅ Inserted ${playlists.length} playlists`);
  console.log(
    `✅ Inserted ${playlistTracks.length} playlist-track relationships`
  );
}
