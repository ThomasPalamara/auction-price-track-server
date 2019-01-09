const CronJob = require('cron').CronJob;
const auctionService = require('../services/auction.srv');

module.exports = function setupCronJobs() {
    const auctionJob = new CronJob('0 */2 * * *', auctionService.refreshAuctionsData, () => console.log('cron job correctly ran'));

    auctionJob.start();
};
