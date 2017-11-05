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
      .catch(err => console.log('error saving song:', err));
    },
    historyByType(type = 'songs', id, limit = 30, offset = 0) { // set "limit" to null to find all
      type === 'songs' ? type = 'song_id' : type = 'playlist_id';
      return knex.raw( ` 
        select * 
        from song_daily_views 
        where ${type} = ? 
        order by created_at desc 
        limit ?
        offset ?;`,
        [id, limit, offset]
      ).catch(err => console.log(err));
    },
    orderBy(type = 'songs', limit = null, offset = 0) {
      if (type === 'playlists') {
        type = 'playlist_id';
      } else {
        type = 'song_id';
      }
      return knex.raw(`
        select * 
        from song_daily_views
        order by ${type}
        limit ${limit}
        offset ${offset};`
      ).catch(err => console.log(err));
    },
    copyByOrder(type = 'songs', file, limit = null, offset = 0) {
      if (type === 'playlists') {
        type = 'playlist_id';
      } else {
        type = 'song_id';
      }
      return knex.raw(`
        copy
          (select * 
          from song_daily_views
          order by ${type}
          limit ${limit}
          offset ${offset})
        to '${file}'
        with csv delimiter ',';`
      ).catch(err => console.log(err));
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
  		}).fetchAll()
      .catch(err => console.log(err));
  	},
  	grabAllHistory: function() {
  		return this.forge().fetchAll().catch(err => console.log(err));
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