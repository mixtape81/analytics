const config = require('../db/config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../db/models.js');
const createTables = require('../db/schema.js');
const { savePlaylists } = require('../db/controller.js');
const { condensePlaylists } = require('../server/helpers.js');
const { incomingPlaylists } = require('../server/dummyData.js');

const { expect } = require ('chai');
const { describe, it, before, beforeEach } = require('mocha');
const request = require('request');
const Promise = require('bluebird');


var playlistsToSave = condensePlaylists(incomingPlaylists);
// example value of playlistsToSave (key => playlist_id)
  // { 1: { views: 1, genre_id: 1 }, 2: { views: 3, genre_id: 1 } }

describe('/addPlaylist', function() {
  beforeEach(function(done) {
    //return new Promise((resolve, reject) => {
    knex.schema.dropTableIfExists('pl_daily_views')
    .then(() => createTables())
    .then(() => done()); 
  });
  
  it('should save playlists to pl_daily_views', function(done) {
    pl_daily_views.forge({
      parent_id: null,
      playlist_id: 1,
      views: 10,
      genre_id: 1
    }).save()

    .then(() => {
      return new Promise((resolve, reject) => {
        resolve(savePlaylists(playlistsToSave))
      })
    })
    .then((result) => {
      return pl_daily_views.forge().fetchAll()
    })
    .then((result) => {
      //console.log(result)
      result.models.forEach(model => {
        console.log(model.attributes)
      });
      done();
    })
  })

});
