require('dotenv').config();
const { CronJob } = require('cron');
const auctionService = require('../services/auction.srv');
const itemStatService = require('../services/itemstat.srv');
const initDbConnexion = require('../db/dbConnection');
const winston = require('../config/winston');

initDbConnexion();

winston.info('Setting Up worker : computeAndSaveItemStats');

const saveStatsJob = new CronJob('0 * * * *', auctionService.refreshAuctionsData, null, true, 'Europe/Paris');

winston.info(`Next run at ${saveStatsJob.nextDates()}`);

winston.info('Setting Up worker deleteOldItemStats');

const deleteOldStatsJob = new CronJob('30 2 * * *', itemStatService.deleteOldItemStats, null, true, 'Europe/Paris');

winston.info(`Next run at ${deleteOldStatsJob.nextDates()}`);
