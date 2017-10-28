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
      .catch(err => console.log(err))
    }
  })
}



module.exports.saveSongs = function(songsToImport, time) {

  return new Promise((resolve, reject) => {
    resolve(songsToImport);
  })
  .tap(songsToImport => {
    let playlistPromises = [];
    songsToImport.forEach(playlist => {

      var totalViews = 0;
      var totalSkips = 0;

      var playlist_id = playlist.playlist_id;
      playlist.songs.forEach(song => {
        totalViews += song.views;
        totalSkips += song.skips;
      })
      playlistPromises.push([playlist_id, totalViews, totalSkips, time])
      //playlist_id_metrics.updateParentWithSong(playlist_id, songViews, songSkips, time)
    })
    
    return Promise.all(playlistPromises)
  })
  .then((songsToImport) => {
    //console.log('song', songsToImport[0])

    let songPromises = [];

    songsToImport.forEach(playlist => {
      var playlist_id = playlist.playlist_id;
      playlist.songs.forEach(song => {
        songPromises.push([song.song_id, playlist_id, song.views, song.skips, song.genre_id, time])
        //songPromises.push(song_daily_views.save(song.song_id, playlist_id, song.views, song.skips, song.genre_id, time))
      })

    })
    console.log(songPromises)

  })
}
