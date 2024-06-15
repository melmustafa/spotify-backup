const { fetchJson } = require("./json.js");

const api_key = "";
const url =
  "https://www.googleapis.com/youtube/v3/search?type=youtube%23video&part=snippet";
const opts = {
  method: "GET",
};
const base_watch_url = "https://www.youtube.com/watch?v=";

async function getSong(title, artist, album) {
  const response = await fetchJson(
    `${url}&q=${title} ${artist} ${album}&key=${api_key}`,
    opts,
  );

  if (response?.items?.length > 0) {
    return `${base_watch_url}${response.items[0]?.id.videoId}`;
  }
  return null;
}

module.exports = { getSong };
