const constants = {
    apiKey: '3mb3sewryrgaymdn23cb6hrhhnrkb9zt',
    blizzardURL: 'https://eu.api.battle.net/wow',
    dbURL: 'mongodb://localhost:27017/auction_price_track',
    //dbURL: 'mongodb://admin:thomaswow1!@ds235022.mlab.com:35022/auction_price_track',
    morganFormat: '[:date[clf]] :method :url :status :res[content-length] - :response-time ms',
    wowProfessions: [
        'alchemy',
        'blacksmithing',
        'enchant',
        'engineering',
        'herbalism',
        'inscription',
        'jewelcrafting',
        'leatherworking',
        'mining',
        'skinning',
        'tailoring',
        'cooking',
    ],
    recipeTypes: [
        'flask',
        'potion',
        'ring',
        'weapon',
        'gem',
        'war scroll',
        'vantus',
        'tome',
    ]
};

module.exports = constants;
