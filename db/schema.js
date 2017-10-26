const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);
const Promise = require('bluebird');

module.exports = function() {
	return new Promise((resolve, reject) => {
		return knex.schema.createTableIfNotExists('pl_daily_views', function(table) {
			table.increments();
			table.integer('playlist_id');
			table.integer('views');
      table.integer('genre_id');
			table.timestamps();
		})

		.then(() => {
			return knex.schema.createTableIfNotExists('playlist_id_metrics', function(table) {
				table.increments();
				table.integer('playlist_id').unique();
				table.integer('genre_id');
				table.integer('totalPlaylistViewCount');
				table.integer('runningTotal');
				table.integer('totalSongViews');
				table.integer('totalSongSkips');
				table.timestamps();
			})
		})    
		.then(() => {
      return knex.schema.createTableIfNotExists('song_daily_views', function(table) {
        table.increments().primary();
        table.integer('song-id');
        table.integer('playlist_id').references('playlist_id_metrics.playlist_id');
        table.integer('views');
        table.integer('skips');
        table.integer('genre_id');
        table.timestamps();
      })
    })

		.then((results) => {
      resolve(results);
		}, (err) => {
			console.log('error making tables', err);
			reject();
		})
  })
}