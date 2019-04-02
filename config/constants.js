const constants = {
    morganFormat: '[:date[clf]] :method :url :status :res[content-length] - :response-time ms',
    retentionPeriod: 15, // Number of days the item stats are stored for
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
    ],
    weekdays: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
};

module.exports = constants;
