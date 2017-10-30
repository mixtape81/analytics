const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);

new Promise((resolve, reject) => {
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
.then(() => console.log('song_daily_views table created'));