const config = {
    apiKey: '3mb3sewryrgaymdn23cb6hrhhnrkb9zt',
    blizzardURL: 'https://eu.api.battle.net/wow',
    // dbURL: 'mongodb://admin:thomaswow1!@ds235022.mlab.com:35022/auction_price_track',
    dbURL: 'mongodb://admin:th0masw0w@ds123852.mlab.com:23852/auction_price_track',
    morganFormat: '[:date[clf]] :method :url :status :res[content-length] - :response-time ms'
};

module.exports = config;
