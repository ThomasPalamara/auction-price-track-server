const moment = require('moment');

exports.roundToNearestHour = date => moment(date)
    .add(30, 'minutes')
    .startOf('hour')
    .toDate();
