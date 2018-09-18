const rp = require('request-promise');
const constants = require('../config/constants');

exports.findAuctionsByRealm = async (realm) => {
    console.time("featchUrl");
    const realmAuctionsUrl = (await fetchRealmAuctionsUrl(realm)).files[0].url;
    console.timeEnd("featchUrl");

    console.time("featchFile");
    const auctions = (await fetchAuctions(realmAuctionsUrl)).auctions;
    console.timeEnd("featchFile");

    console.time("format Prices");
    const prices = getPrices(auctions);
    console.timeEnd("format Prices");

    return prices;
};

fetchRealmAuctionsUrl = (realm) => {
    return rp(`${constants.blizzardURL}/auction/data/${realm}?locale=fr_FR&apikey=${constants.apiKey}`, {json: true})
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