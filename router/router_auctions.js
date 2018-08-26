const rp = require('request-promise');
const winston = require('../winston');
const router = require('express').Router();
const config = require('../config');

router.get('/auctions/:realm', async (req, res) => {
    let slug = req.params.realm;

    try {
        const realmAuctionsUrl = (await fetchRealmAuctionsUrl(slug)).files[0].url;
        const auctions = (await fetchAuctions(realmAuctionsUrl)).auctions;

        let formatedAuctions = getPrices(auctions);

        res.json(formatedAuctions);
    }
    catch (error) {
        winston.error('Error unknown : ' + error);

        res.statusCode = 500;
        res.send({message : 'Something bad happened'});
    }
});

const fetchRealmAuctionsUrl = (realm) => {
    return rp(`${config.blizzardURL}/auction/data/${realm}?locale=fr_FR&apikey=${config.apiKey}`, {json: true})
};

const fetchAuctions = (auctionsUrl) => {
    return rp(auctionsUrl, {json: true})
};

const getPrices = (auctions) => {
    let formatedAuctions = {};

    auctions.forEach(auction => {
        let unitPrice = Math.round(auction.buyout / auction.quantity);

        if (!formatedAuctions[auction.item]) {
            formatedAuctions[auction.item] = {};
            formatedAuctions[auction.item].prices = [{
                price: unitPrice,
                quantity: auction.quantity
            }];

            formatedAuctions[auction.item].total_quantity = auction.quantity;
        }
        else if(auction.buyout > 0) {
            formatedAuctions[auction.item].total_quantity += auction.quantity;

            let formatedAuction = formatedAuctions[auction.item].prices.find(formatedAuction => formatedAuction.price === unitPrice);

            if (formatedAuction) {
                formatedAuction.quantity += auction.quantity;
            }
            else {
                formatedAuction = {
                    price: unitPrice,
                    quantity: auction.quantity
                };

                formatedAuctions[auction.item].prices.push(formatedAuction);
            }
        }
    });

    data = [];
    for (const key of Object.keys(formatedAuctions)) {
        const x = formatedAuctions[key];

        data.push({
            item_id: key,
            auctions: [{
                prices: x.prices,
                total_quantity: x.total_quantity
            }]
        })
    }

    return data;
};

module.exports = router;