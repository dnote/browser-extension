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

export function post(url, data) {
  return request(url, {
    method: "POST",
    body: data
  });
}

export function get(url) {
  return request(url, {
    method: "GET"
  });
}
