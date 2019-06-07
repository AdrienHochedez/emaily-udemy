const mongoose = require('mongoose');
const { Schema } = mongoose;

const competitorSchema = new Schema({
    _user: { type: String, ref: 'User' },
    responded: { type: Boolean, default: false}
});

module.exports = competitorSchema;