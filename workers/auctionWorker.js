const CronJob = require('cron').CronJob;
const auctionService = require('../services/auction.srv');

console.log("Setting Auctions' Workers");

const auctionJob = new CronJob('0 */2 * * *', auctionService.refreshAuctionsData, () => console.log('cron job correctly ran'));

auctionJob.start();

console.log(`Next Cron starting at ${auctionJob.nextDates()}`);
