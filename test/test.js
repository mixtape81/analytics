const config = require('../db/config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../db/models.js');
const createTables = require('../db/schema.js');
const { condesePlaylists } = require('../server/helpers.js');
const { incomingPlaylists } = require('../server/dummyData.js');

const { assert } = require ('chai');
const { describe, it, before, beforeEach } = require('mocha');
const request = require('request');
const Promise = require('bluebird');

var playlistsToSave = condesePlaylists(incomingPlaylists);
// example value of playlistsToSave (key => playlist_id)
  // { 1: { views: 1, genre_id: 1 }, 2: { views: 3, genre_id: 1 } }

describe('/addPlaylist', function() {
  beforeEach(function() {
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
      .then(() => resolve(), (err) => reject(err));
    });  
  })
  
  it('should add a new song to db', function(result) {
      
      return pl_daily_views.forge().fetchAll()
      
      .then((result) => {
        console.log(result.models)
      })
    })

});
