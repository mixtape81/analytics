//grab knex, bookshelf, models, schema
const config = require('../config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../models.js');
const createTables = require('../schema.js');
const Promise = require('bluebird');

const playlistIdTest = 2;

module.exports =  function() {

  return new Promise((resolve, reject) => {
  	knex.schema.dropTableIfExists('pl_daily_views')
  	.then(() => createTables())
  	.then(() => {
      return pl_daily_views.forge({
        parent_id: null,
        playlist_id: playlistIdTest,
        views: 10,
        genre_id: 3
      }).save();
  	})
  	.then(() => {
  		return pl_daily_views.playlistHistory(playlistIdTest);
  	})
  	.then((results) => console.log(results))
    .then(() => resolve(), (err) => reject(err));
  });  

};
