const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);

const extensions = [
  {
  	tableName: 'pl_daily_views',
  }, {
  	playlistHistory: function(playlistID) {
  		return this.forge().query({
  			where: { 
  				playlist_id: playlistID
  			}
  		}).fetchAll();
  	},
  	grabAllPlaylists: function() {
  		return this.forge().fetchAll();
  	}
  }
];

module.exports.pl_daily_views = bookshelf.Model.extend(...extensions);
