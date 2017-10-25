const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);
const Promise = require('bluebird');

module.exports = function() {
	return new Promise((resolve, reject) => {
		return knex.schema.createTableIfNotExists('pl_daily_views', function(table) {
			table.increments();
			table.integer('parent_id')
			table.integer('playlist_id');
			table.integer('views');
      table.integer('genre_id');
			table.timestamps();
		})
		// .then(() => {
		// 	return knex.schema.dropTable('playlist_parent_id')
		// })
		.then(() => {
			return knex.schema.createTableIfNotExists('playlist_parent_id', function(table) {
				table.increments();
				table.integer('playlist_id');
				table.integer('parent_id');
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