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
          return playlist_id_metrics.updateParentWithPlaylist(playlist_id, playlist.views, time)
        } else {
          return playlist_id_metrics.saveToParentTable(playlist_id, playlist.genre_id, playlist.views, time)
        } 
      })
      .then(() => {
        //save playlist
        return pl_daily_views.forge({
          playlist_id: playlist_id,
          genre_id: playlist.genre_id,
          views: playlist.views,
          created_at: time,
          updated_at: time
        })
        .save();
      })
      .then((results) => {
        saved.push(results);
      })
      .then(() => {
        currentPlaylist++;
      })
      .then(() => {
        if (currentPlaylist === totalPlaylists) {
          console.log('playlists for time:', time, 'saved at:', new Date())
          resolve(saved);
        }
      })
      .catch(err => reject(err))
    }
  })
}

module.exports.saveSongs = function(songsToImport, time) {
  console.log('fn invoked at', new Date());
  return new Promise((resolve, reject) => {
    resolve(songsToImport);
  })
  .tap(songsToImport => {
    let playlistPromises = [];
    songsToImport.forEach(playlist => {

      let totalViews = 0;
      let totalSkips = 0;

      playlist.songs.forEach(song => {
        totalViews += song.views;
        totalSkips += song.skips;
      })
      playlist_id_metrics.updateParentWithSong(playlist.playlist_id, totalViews, totalSkips, time);
    });
    songsToImport = null; // minimize pointers
    return Promise.all(playlistPromises);
  })
  .then((songsToImport) => {
    let songPromises = [];

    songsToImport.forEach(playlist => {
      playlist.songs.forEach(song => {
        songPromises.push(song_daily_views.save(song.song_id, playlist.playlist_id, song.views, song.skips, song.genre_id, time));
      });
    });
    songsToImport = null;
    return Promise.all(songPromises);
  })
  .then(results => console.log('saved at', new Date()))
  .catch(err => reject(err));
}

module.exports.songHistoryPretty = function(playlist_id) {
  return song_daily_views.historyByType('playlist', ['song_id'], playlist_id)
  .then(recentSongs => {
    return recentSongs.rows;
  })
}
