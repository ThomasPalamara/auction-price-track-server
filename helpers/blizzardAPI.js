const axios = require('axios');

const axiosInstance = axios.create();

const blizzardAPIURL = "https://eu.api.blizzard.com/wow";

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // '!originalRequest.isRetry' prevents a request loop from happening if authentification keeps failing
        if (error.response.status === 401 && !originalRequest.isRetry) {
            originalRequest.isRetry = true;

            const accessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return axiosInstance(originalRequest);
        }
        else {
            return Promise.reject(error);
        }

    }
);

const refreshAccessToken = async () => {
    const tokenInfo = await axiosInstance.post(`https://eu.battle.net/oauth/token?grant_type=client_credentials`, null,
        {
            auth: {
                username: process.env.BLIZZARD_CLIENT_ID,
                password: process.env.BLIZZARD_CLIENT_SECRET
            }
        }).then(function (response) {
            return response.data;
        });

    axiosInstance.defaults.headers.Authorization = tokenInfo.access_token;

    return tokenInfo.access_token;
};

exports.fetchRealmAuctionsUrl = (realm) => {
    return axiosInstance.get(`${blizzardAPIURL}/auction/data/${realm}?locale=fr_FR`)
        .then(function (response) {
            return response.data;
        });
};

exports.fetchAuctions = (auctionsUrl) => {
    return axiosInstance.get(auctionsUrl)
        .then(function (response) {
            return response.data;
        });
};

exports.fetchItem = async (itemId) => {
    return axiosInstance.get(`${blizzardAPIURL}/item/${itemId}?locale=en_GB`)
        .then(function (response) {
            return response.data;
        });
};

exports.fetchItemFR = async (itemId) => {
    return axiosInstance.get(`${blizzardAPIURL}/item/${itemId}?locale=fr`)
        .then(function (response) {
            return response.data;
        });
};

exports.fetchRealms = () => {
    return axiosInstance.get(`${blizzardAPIURL}/realm/status?locale=en_GB`)
        .then(function (response) {
            return response.data;
        });
};

refreshAccessToken();
