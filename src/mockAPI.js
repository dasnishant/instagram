async function mockApi(url, method, body = null, headers = {}) {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-type": "application/json",
      ...headers,
    },
    body: method !== "GET" ? JSON.stringify(body) : body,
  });
  const jsonResponse = await response.json();
  if (jsonResponse.success) {
    return jsonResponse.data;
  }
}

//typescript explore(react->redux store , saga and react native-> navigation)

var BASE_URL = "https://run.mocky.io/v3/";

function getUrl(url) {
  return `${BASE_URL}${url}`;
}

export default mockApi;

export { getUrl };
