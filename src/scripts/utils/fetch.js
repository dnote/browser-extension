import qs from "qs";
import config from "./config"

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return response.text().then(body => {
      let error = new Error(body);
      error.response = response;

      throw error;
    });
  }
}

function parseJSON(response) {
  return response.json();
}

function request(url, options) {
  const opts = {
    ...options,
    headers: {
      ...options.headers,
      'Extension-Version': config.version
    }
  }


  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function post(url, data, options = {}) {
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
