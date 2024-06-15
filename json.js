async function fetchJson(url, opts) {
  const response = await fetch(url, opts);

  return await response.json();
}

module.exports = { fetchJson };
