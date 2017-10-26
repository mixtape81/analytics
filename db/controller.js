const { pl_daily_views, playlist_id_metrics, song_daily_views } = require('./models.js');
const Promise = require('bluebird');
const config = require('./config.js')
const knex = require('knex')(config);

module.exports.savePlaylists = function(processedPlaylists, time) {
  console.log(time)
  var saved = [];
  var totalPlaylists = 0;
  var currentPlaylist = 0;
  for (let i in processedPlaylists) {
    totalPlaylists++;
  }
  return new Promise((resolve, reject) => {
    for (let playlist_id in processedPlaylists) {
      let playlist = processedPlaylists[playlist_id];
      pl_daily_views.query({where: {playlist_id: playlist_id}})
      .fetch()
      .then((result) => {
        if (result) {
          return pl_daily_views.forge({
            playlist_id: playlist_id,
            genre_id: playlist.genre_id,
            views: playlist.views,
            created_at: time,
            updated_at: time
          })
          .save()
          .then((resultToThrow) => {
            return playlist_id_metrics.query({where: {playlist_id: playlist_id}})
            .fetch()
            .then(result => {
              return playlist_id_metrics.updateParentWithPlaylist(playlist_id, playlist.views, time)
            })
            .then(() => {
              return resultToThrow;
            })
          })
        } else {
          return pl_daily_views.forge({
            playlist_id: playlist_id,
            genre_id: playlist.genre_id,
            views: playlist.views,
            created_at: time,
            updated_at: time
          })
          .save()
          .then((results) => {
            return playlist_id_metrics.saveToParentTable(playlist_id, playlist.genre_id, playlist.views, time)
            .then(() => results)
          })
        } 
      })
      .then((results) => {
        saved.push(results);
      })
      .then(() => {
        currentPlaylist++;
      })
      .then(() => {
        if (currentPlaylist === totalPlaylists) {
          resolve(saved);
        }
      })
      .catch(err => console.log(err))
    }
  })
}

module.exports.saveSongs = function(processedSongs, time) {

  // update playlist with 
    // total number of songs played
    // total number of songs skipped
  song_daily_views



}
