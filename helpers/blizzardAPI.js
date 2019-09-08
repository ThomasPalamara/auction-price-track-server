const axios = require("axios");

const axiosInstance = axios.create();

const blizzardAPIURL = "https://eu.api.blizzard.com/wow";

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    /*
     * '!originalRequest.isRetry' prevents a request loop from happening if
     * authentification keeps failing
     */
    if (error.response.status === 401 && !originalRequest.isRetry) {
      originalRequest.isRetry = true;

      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const tokenInfo = await axiosInstance
    .post(
      "https://eu.battle.net/oauth/token?grant_type=client_credentials",
      null,
      {
        auth: {
          username: process.env.BLIZZARD_CLIENT_ID,
          password: process.env.BLIZZARD_CLIENT_SECRET
        }
      }
    )
    .then(response => response.data);

  axiosInstance.defaults.headers.Authorization = tokenInfo.access_token;

  return tokenInfo.access_token;
};

exports.fetchRealmAuctionsUrl = realm =>
  axiosInstance
    .get(`${blizzardAPIURL}/auction/data/${realm}?locale=fr_FR`)
    .then(response => response.data);

exports.fetchAuctions = auctionsUrl =>
  axiosInstance.get(auctionsUrl).then(response => response.data);

exports.fetchItem = itemId =>
  axiosInstance
    .get(`${blizzardAPIURL}/item/${itemId}?locale=en_GB`)
    .then(response => response.data);

exports.fetchItemFR = itemId =>
  axiosInstance
    .get(`${blizzardAPIURL}/item/${itemId}?locale=fr`)
    .then(response => response.data);

exports.fetchRealms = () =>
  axiosInstance
    .get(`${blizzardAPIURL}/realm/status?locale=en_GB`)
    .then(response => response.data);

refreshAccessToken();
