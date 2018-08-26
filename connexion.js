const mongoose = require('mongoose');
const config = require('./config');

mongoose.Promise = global.Promise;

mongoose.connect(config.dbURL, { useNewUrlParser: true });
mongoose.connection.once('open', () => {console.log('connected');})
.on('error',(error) => {
    console.log('Error', error);
}); 
