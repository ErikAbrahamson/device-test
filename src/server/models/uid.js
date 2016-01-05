var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UniqueID = new Schema({
    assignment: { type: String }
});

module.exports = mongoose.model('UniqueIDs', UniqueID);
