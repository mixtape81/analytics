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

var incomingSongs = [
  {
    playlist_id: 1,
    songs: [
      {
        "id": 25,
        "song_id": 1498322,
        "listenedTo": true,
        "playlist_id": 1,
        "genre_id": 8,
        "date": "2017-10-25",
        "createdAt": "2017-10-26T02:10:24.965Z",
        "updatedAt": "2017-10-26T02:10:24.965Z",
        "logId": 100
      },
      {
        "id": 50,
        "song_id": 523423,
        "liked": false,
        "playlist_id": 1,
        "genre_id": 8,
        "date": "2017-10-25",
        "createdAt": "2017-10-26T02:10:24.965Z",
        "updatedAt": "2017-10-26T02:10:24.965Z",
        "logId": 120
      }
    ]
  }
];

//how to put it into my db
/* 
  for each song 


*/

module.exports.condenseSongs = function(songsByPlaylist) {
  
  var results = {};
  
  songsByPlaylist.forEach((playlistGroup) => {
    let playlist_id = results[playlistGroup.playlist_id]
    if (results[playlist_id]) {
      console.log('hi')
    } else {
      results[playlist_id] = {};
      
    }
  })

}