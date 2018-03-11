import qs from "qs";

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function request(url, options) {
  return fetch(url, options).then(checkStatus).then(parseJSON);
}

export function post(url, data, options = {}) {
  console.log("@@@@@@@@@@@@@@@", data);
  return request(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options
  });
}

export function get(url, options = {}) {
  let endpoint = url;

  if (options.params) {
    endpoint = `${endpoint}?${qs.stringify(options.params)}`;
  }

  return request(endpoint, {
    method: "GET",
    ...options
  });
}
