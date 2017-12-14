const config = require('../db/config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../db/models.js');
const createTables = require('../db/schema.js');
const { savePlaylists } = require('../db/controller.js');

const { condensePlaylists } = require('../server/helpers.js');
const { incomingPlaylists } = require('../server/dummyData.js');
const { listening } = require('../server/index.js');

const { expect } = require ('chai');
const { describe, it, before, beforeEach } = require('mocha');
const request = require('supertest');
const Promise = require('bluebird');
const _ = require('lodash');

var playlistsToSave = condensePlaylists(incomingPlaylists);
// example value of playlistsToSave (key => playlist_id)
  // { 1: { views: 1, genre_id: 1 }, 2: { views: 3, genre_id: 1 } }

describe('condensePlaylists', function() {
  it('should reduce the correct number of playlists', function() {
    var incomingPlaylists = [
      {playlist_id: 2, genre_id: 1},
      {playlist_id: 1, genre_id: 1},
      {playlist_id: 2, genre_id: 1}
    ];
    var condensedCount = 0;
    var condensedPlaylists = condensePlaylists(incomingPlaylists);
    _.each(condensedPlaylists, () => condensedCount++);

    expect(condensedCount).to.equal(2);
  });
});

describe('/addPlaylist', function() {
  beforeEach(function(done) {
    knex.schema.dropTableIfExists('song_daily_views') 
    .then(() => knex.schema.dropTableIfExists('playlist_id_metrics'));
    .then(() => knex.schema.dropTableIfExists('pl_daily_views'));
    .then(() => createTables())
    .then(() => done()); 
  });
  
  it('should handle asynchronous saves to pl_daily_views', function(done) {
    pl_daily_views.forge({ // initial saved playlist
      playlist_id: 1,
      views: 10,
    })
    .save()
    .then(() => {
      return savePlaylists(playlistsToSave, new Date());
    })
    .then(() => {
      return savePlaylists(playlistsToSave, new Date());
      
    })
    .then((result) => {
      return pl_daily_views.forge().fetchAll()
    })
    .then((result) => {
      var incomingCount = 1; // one for initial saved playlist
      var savedCount = 0;
      _.forEach(playlistsToSave, () => incomingCount+=2);
      result.models.forEach(model => savedCount++);
      expect(incomingCount).to.equal(savedCount);
      
      done();
    })
  })

  it('should save to pl_daily_views on get /playlistviews from userints', function(done) {
    request(listening)
    .get('/playlistviews')
    .expect(200, done);

  });
});

describe('/playlistHistory', function(done) {

  it('should retrieve playlist history by Id', function() {
    request(listening)
    .get('/playlistHistory')
    .expect(200, done)
  })
});