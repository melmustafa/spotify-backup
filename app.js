const fs = require("fs");
const { getAllUserPlaylists, getPlaylistSongs } = require("./spotify.js");
const { getSong } = require("./youtube.js");

function backupPlaylist(name, track_list) {
  let data = '"name", "album", "artist", "spotify link", "youtube link"\n';
  for (const t of track_list) {
    data =
      data +
      `"${t.name}", "${t.album}", "${t.artist}", "${t.spotify_link}", "${t.youtube_link}"\n`;
  }
  fs.writeFile(`backup/${name}.csv`, data, "utf-8", (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function backUserPlaylists(user_id) {
  const playlists = await getAllUserPlaylists(user_id);

  for (const list of playlists) {
    let tracks = await getPlaylistSongs(list.id);
    for (let i = 0; i < tracks.length; ++i) {
      tracks[i].youtube_link = await getSong(
        tracks[i].name,
        tracks[i].artist,
        tracks[i].album,
      );
    }
    backupPlaylist(list.name, tracks);
  }
}

async function main() {
  await backUserPlaylists("e6c9e6yx8ncp46n7nvllmcymh");
}

main();
