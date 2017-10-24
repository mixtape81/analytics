const { pl_daily_views } = require('./models.js');
const Promise = require('bluebird');

module.exports.savePlaylists = function(processedPlaylists) {
  var saved = [];
    //check if there is a playlist with no views;
    //save time stamp for the day;
  var totalPlaylists = 0;
  var currentPlaylist = 0;
  for (let i in processedPlaylists) {
    totalPlaylists++;
  }
  return new Promise((resolve, reject) => {
    for (let playlist_id in processedPlaylists) {
      let playlist = processedPlaylists[playlist_id];
   
      pl_daily_views.query({where: {playlist_id: playlist_id, parent_id: null}});
      .fetch()
      .then((result) => {
        if (result) {
          let parent_id = result.attributes.id;
          return pl_daily_views.forge({
            parent_id: parent_id,
            playlist_id: playlist_id,
            views: playlist.views,
            genre_id: playlist.genre_id
          }).save()
        } else {
          return pl_daily_views.forge({
            parent_id: null,
            playlist_id: playlist_id,
            views: playlist.views,
            genre_id: playlist.genre_id
          }).save();
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
    }
  })
}
