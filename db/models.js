const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);

const pldvExtension = [
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
  	grabAllHistory: function() {
  		return this.forge().fetchAll();
  	}
  }
];

const ppidExtension = [
  {
    tableName: 'playlist_parent_id'
  }, {
    grabAllParentIds: function() {
      return this.forge.fetchAll();
    },
    saveToParentTable: function(playlist_id, idAsNull) {
      return this.forge({
        playlist_id: playlist_id,
        parent_id: idAsNull,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      }).save()
      .catch((err) => {
        console.log(err)
      });
    }
  }
];

module.exports.pl_daily_views = bookshelf.Model.extend(...pldvExtension);
module.exports.playlist_parent_id = bookshelf.Model.extend(...ppidExtension);
