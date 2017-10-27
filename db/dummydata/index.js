const config = require('../config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../models.js');
const { numAndHalfRandomizer, createDailyPlaylists } = require('./helpers.js');
const createTables = require('../schema.js');
const Promise = require('bluebird');

const { savePlaylists, condenseSongs } = require('../controller.js');
const { condensePlaylists } = require('../../server/helpers.js');
let { incomingPlaylists, incomingSongs } = require('../../server/dummyData.js')


module.exports = function(time) {

  return new Promise((resolve, reject) => {
    console.log(time)
      // createTables()
      // .then(() => {
    resolve(createDailyPlaylists(40000))
      // })
  })
  .then((results) => {
      return condensePlaylists(results);
  })
  .then((results) => {
    return savePlaylists(results, time)
  })
	.then((results) => console.log('hello in dummy'))
  .catch(err => reject(err)) 

};
