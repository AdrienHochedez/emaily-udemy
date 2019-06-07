const mongoose = require('mongoose');
const { Schema } = mongoose;
const competitorSchema = require('./Recipient');

const challengeSchema = new Schema({
  title: String,
  rounds: Number,
  buyin: Number,
  competitors: [competitorSchema],
  dateSent: Date
});

mongoose.model('challenges', challengeSchema);
