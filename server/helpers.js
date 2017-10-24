module.exports.condensePlaylists = function(playlists) {
  //adds up all the playlists of the same id
  return playlists.reduce((results, playlist) => {
    var id = playlist.playlist_id;
    if (results[id]) { 
      results[id].views ++;
    } else {
      results[id] = {};
      results[id].views = 1;
      results[id].genre_id = playlist.genre_id;
    }
    return results;
  }, {});
}