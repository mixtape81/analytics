const config = require('../config.js');
const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);
const { pl_daily_views } = require('../models.js');
const createTables = require('../schema.js');
const Promise = require('bluebird');

const { savePlaylists } = require('../controller.js');
const { condensePlaylists } = require('../../server/helpers.js');


numAndHalfRandomizer = function(highest) {
  var num = Math.ceil(Math.random() * highest);
  var halfNum = Math.ceil(num / 2)
  return [num, halfNum];
};

function createDailyPlaylists(dailyViewTotal) {
  var results = [];
  for (var i = 0; i < dailyViewTotal; i++) {
    var numsGen = numAndHalfRandomizer(1000);
    results.push({playlist_id: numsGen[0], genre_id: numsGen[1]})
  }
  return results;
} 
//const incomingPlaylists = createDailyPlaylists(1000);
var incomingPlaylists = [
  {playlist_id: 2, genre_id: 1},
  {playlist_id: 1, genre_id: 1},
  {playlist_id: 3, genre_id: 1},
  {playlist_id: 4, genre_id: 2},
  {playlist_id: 5, genre_id: 3},
  {playlist_id: 1, genre_id: 1}
];
const dailyPlaylists = condensePlaylists(incomingPlaylists);


module.exports =  function() {

  return new Promise((resolve, reject) => {
    createTables()
    .then(() => savePlaylists(dailyPlaylists, new Date()) )
    //savePlaylists(dailyPlaylists, new Date())
  	.then(() => {
  		return savePlaylists(dailyPlaylists, new Date());
  	})
  
  	.then((results) => console.log('hello in dummy'))
    .then(() => resolve(), (err) => reject(err));
  });  

};
