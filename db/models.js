const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);


const songExtension = [
  {
    tableName: 'song_daily_views'
  }, {
    grabAllHistory: function() {
      return this.forge.fetchAll();
    },
    save: function(song_id, playlist_id, views, skips, genre_id, time) {
      return this.forge({
        song_id: song_id,
        playlist_id: playlist_id,
        views: views,
        skips: skips,
        genre_id: genre_id,
        created_at: time,
        updated_at: time
      }).save()
      .catch(err => console.log('error saving song:', err))
    }
  }
];

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

const pidmExtension = [
  {
    tableName: 'playlist_id_metrics'
  }, {
    grabAllParentIds: function() {
      return this.forge.fetchAll();
    },
    saveToParentTable: function(playlist_id, genre_id, viewCount, time) {
      return this.forge({
        playlist_id: playlist_id,
        genre_id: genre_id,
        totalPlaylistViewCount: viewCount,
        runningTotal: 1,
        created_at: time,
        updated_at: time
      }).save()
      .catch((err) => {
        console.log(err)
      });
    },
    updateParentWithPlaylist: function(playlist_id, viewCount, time) {
      return this.forge().query({
        where: {
          playlist_id: playlist_id
        }
      })
      .fetch()
      .then((results) => {
        let id = results.attributes.playlist_id;
        let currentViewCount = results.attributes.totalPlaylistViewCount;
        let runningTotal = results.attributes.runningTotal;

        return this.forge()
          .query({where: {id: id}})
          .save({
            totalPlaylistViewCount: currentViewCount + viewCount,
            runningTotal: runningTotal + 1,
            updated_at: time
          }, {
            patch: true
          })
          .catch(err => console.log(err))
      })
    },
    updateParentWithSong: function(playlist_id, songViews, songSkips, time) {
      return this.forge().query({
        where: {
          playlist_id: playlist_id
        }
      })
      .fetch() 
      .then(results => {
        let id = results.attributes.playlist_id;
        let totalSongViews = results.attributes.totalSongViews;
        let totalSongSkips = results.attributes.totalSongSkips;
        totalSongViews = totalSongViews ? totalSongViews : 0;
        totalSongSkips = totalSongSkips ? totalSongSkips : 0;

        return this.forge()
          .query({where: {id: id}})
          .save({
            totalSongViews: totalSongViews + songViews,
            totalSongSkips: totalSongSkips + songSkips,
            updated_at: time 
          }, {
            patch: true
          })
          .catch(err => console.log(err));
      })
    }
  }
];

module.exports.pl_daily_views = bookshelf.Model.extend(...pldvExtension);
module.exports.playlist_id_metrics = bookshelf.Model.extend(...pidmExtension);
module.exports.song_daily_views = bookshelf.Model.extend(...songExtension);