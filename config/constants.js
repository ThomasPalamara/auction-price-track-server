const constants = {
    blizzardAPIURL: 'https://eu.api.battle.net/wow',
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
