const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Challenge = mongoose.model('challenges');

module.exports = app => {
  app.post('/api/challenges', requireLogin, requireCredits, (req, res) => {
    const { title, rounds, buyin, competitors } = req.body;

    const challenge = new Challenge({
      title,
      rounds,
      buyin,
      competitors: competitors.split(',').map(user => ({ user: user.id.trim() })),
      dateSent: Date.now()
    })
  });
};
