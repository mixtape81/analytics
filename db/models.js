const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);

module.exports.pl_daily_views = bookshelf.Model.extend({
	tableName: 'pl_daily_views',
	//hasTimeStamps: true,
}, {
	hello: function() {
    console.log('hi')
	},
	playlistHistory: function(playlistID) {
		return this.forge().query({
			where: { 
				playlist_id: playlistID
			}
		}).fetchAll();
	}
})
