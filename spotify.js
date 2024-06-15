const { fetchJson } = require("./json.js");

const client_id = "";
const client_secret = "";

async function getToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  return await response.json();
}

function parsePlaylistSongs(playlist) {
  const tracks = playlist?.items?.map((item) => ({
    name: item.track.name,
    album: item.track.album.name,
    artist: item.track.artists[0].name,
    spotify_link: item.track.href,
  }));

  return tracks || [];
}

async function getPlaylist(access_token, playlist_id) {
  const opts = {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  };
  let response = await fetchJson(
    `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=next,items%28track%28name%2Chref%2Calbum%28name%29%2Cartists%28name%29%29%29&locale=en`,
    opts,
  );

  const tracks = parsePlaylistSongs(response);

  while (response.next != null) {
    const next = response.next;
    response = await fetchJson(next, opts);
    tracks.push(...parsePlaylistSongs(response));
  }

  return tracks;
}

async function getPlaylistSongs(playlist_id) {
  const token = (await getToken()).access_token;
  const playlist = await getPlaylist(token, playlist_id);
  return playlist;
}

function parseUserPlaylists(rawLists) {
  const lists = rawLists?.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  return lists || [];
}

async function getUserPlaylists(access_token, user_id) {
  const opts = {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  };
  let response = await fetchJson(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    opts,
  );

  const lists = parseUserPlaylists(response?.items);

  while (response.next != null) {
    response = await fetchJson(response.next, opts);
    lists.push(...parseUserPlaylists(response?.items));
  }

  return lists;
}

async function getAllUserPlaylists(user_id) {
  const token = (await getToken()).access_token;
  const playlists = await getUserPlaylists(token, user_id);
  return playlists;
}

module.exports = { getAllUserPlaylists, getPlaylistSongs };
