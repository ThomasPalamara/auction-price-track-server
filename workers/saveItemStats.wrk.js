require('dotenv').config();
const { CronJob } = require('cron');
const auctionService = require('../services/auction.srv');
const initDbConnexion = require('../config/db');
const winston = require('../config/winston');

initDbConnexion();

winston.info("Setting Up auctions' worker");

const auctionJob = new CronJob('0 * * * *', auctionService.refreshAuctionsData, () => winston.info('cron job correctly ran'));

auctionJob.start();

winston.info(`Next run at ${auctionJob.nextDates()}`);
