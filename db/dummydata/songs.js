const { playlist_id_metrics, song_daily_views } = require('../models.js');
let { numAndHalfRandomizer } = require('./helpers.js');
const TotalSongs = 10000000

function quadExcRand(num) {
	return Math.ceil(num + Math.random() * num) * num;
}
function intRand(num) {
	return Math.ceil(Math.random() * num);
}
function inclusiveRand(num) {
	return Math.ceil(Math.random() * num);
}

module.exports.createDailySongs = function() {

  var j = 1;
  var max = 31;
  var fix = 31;

  function hashNumSelector(num) {
  	var hasher = [quadExcRand(num), num, num, num, num]
    var selector = Math.floor(Math.random() * hasher.length)
    return hasher[selector];
  }
  
  var incomingSongs = [];
  for (let i = 1; i <= 10; i++) {
  	let playlist = {
  		playlist_id: i,
  		songs: []
  	};
  	for (j; j < max; j++) {
      playlist.songs.push({
      	song_id: hashNumSelector(j),
      	views: intRand(1000),
        skips: intRand(1000),
        genre_id: Math.ceil(i / 2)
      });
  	}
  	max += fix;
  	incomingSongs.push(playlist);
  }
  return incomingSongs;

};
console.log(module.exports.createDailySongs()[0].songs);