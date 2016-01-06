var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UniqueID = new Schema({ fingerprint: { type: String } });

module.exports = mongoose.model('UniqueIDs', UniqueID);
