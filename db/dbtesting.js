const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);
const { song_daily_views } = require('./models.js');
const Promise = require('bluebird');
const { testfile } = require('./constants.js');
const fs = require('fs');
const _ = require('lodash');

console.log(new Date())
song_daily_views.copyByOrder('songs', testfile, 10, 1)
.then(() => {
  console.log(new Date())
  //fs.readFile('./testcsv.csv', (res) => console.log(res))
})

var hash = {};
song_daily_views.orderBy('songs', 1000000, 0) 
.then(results => {
  results.rows.forEach(row => {
    if (hash[row.song_id]) {
      hash[row.song_id].views += row.views;
      hash[row.song_id].skips += row.skips;
    } else { 
      hash[row.song_id] = {
        views: row.views,
        skips: row.skips
      }
    }
  })
})
.then(() => {
  console.log(new Date(), hash)
})

/*
console.log(new Date())
song_daily_views.orderBy('songs', 1, 999999)
.then((res) => {
  console.log(res.rows.length, 'orderByType', new Date())
  console.log(res.rows[res.rows.length - 1])
  //console.log(res.rows)
})
*/



/*new Promise((resolve, reject) => {
  return knex.schema.createTableIfNotExists('song_daily_views', function(table) {
    table.increments().primary();
    table.integer('song_id');
    table.integer('playlist_id').references('playlist_id_metrics.playlist_id');
    table.integer('views');
    table.integer('skips');
    table.integer('genre_id');
    table.timestamps();
  })
  .then(results => {
  	resolve(results);
  })
  .catch(err => reject(err));
})
.then(() => console.log('song_daily_views table created'));*/

