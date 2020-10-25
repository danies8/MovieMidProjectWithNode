const axios = require('axios');

exports.getAllMoviesFromApi = () => {
  return axios.get("https://api.tvmaze.com/shows");
}

