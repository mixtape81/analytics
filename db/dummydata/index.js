const config = require('../config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../models.js');
const { numAndHalfRandomizer, createDailyPlaylists, dailyViewTotal } = require('./helpers.js');
const createTables = require('../schema.js');
const Promise = require('bluebird');

const { savePlaylists, saveSongs } = require('../controller.js');
const { condensePlaylists } = require('../../server/helpers.js');
let { incomingPlaylists, incomingSongs } = require('../../server/dummyData.js')


module.exports.createAndSavePlaylists = function(time) {

  return new Promise((resolve, reject) => {
    resolve(createDailyPlaylists(dailyViewTotal))
  })
  .then((results) => {
      return condensePlaylists(results);
  })
  .then((results) => {
    return savePlaylists(results, time)
  })
	.then((results) => console.log('finished saving playlist', time))
  .catch(err => reject(err)) 
};

module.exports.createAndSaveSongs = function(time) {

};
