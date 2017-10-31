const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);
let { song_daily_views } = require('./models.js');
const Promise = require('bluebird');



song_daily_views.findLatestByPlaylist(30, 30).then((res) => console.log(res.rows))

new Promise((resolve, reject) => resolve(song_daily_views.findLatestByPlaylist(30, 30)))
  .then((results) => {
   //console.log(results.rows);
  })



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

