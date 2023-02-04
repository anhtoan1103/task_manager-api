// This file will handle connection to the mongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://toanta:genshin2022@cluster0.wbszohr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log('connected to mongoose');
    })
    .catch((e) => {
        console.log("Error:" + e)
    });

// To prevent deprectation warnings (from mongoDB native driver)

module.exports = {
    mongoose
};