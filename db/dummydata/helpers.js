//playlist helpers
module.exports.maximizeStack = 20000;

module.exports.playlistNumber = 200;
module.exports.songsPerPlaylist = 30;

module.exports.TotalCycles = 2160; // 1 cylce measures 1 hour

module.exports.dailyViewTotal = module.exports.TotalCycles * module.exports.playlistNumber * 20;

module.exports.maxSavesPerRound = 20000 / module.exports.playlistNumber;
module.exports.timeoutPerSave = module.exports.maxSavesPerRound * module.exports.playlistNumber * 2.8; // milliseconds;

/*
* use above constants to manage stack size for repeated cycles of playlist saves
*/

module.exports.timeoutData = function(saveType = 'playlist') {
	var maximizeStack;
	var saveEfficiency = 1; // 0 is best;
	var savesPerCycle;
	if (saveType === 'playlist') {
    savesPerCycle = 200;
    maximizeStack = 20000
	} else if (saveType === 'songs') {
		savesPerCycle = 6000;
		saveEfficiency = 0.35;
		maximizeStack = 30000
	}

	var results = {};

	results.maxSavesPerRound = maximizeStack / savesPerCycle;
	results.timeoutPerSave = maximizeStack * 2.8 * saveEfficiency;

  return results;
}

/*
* use timeoutData function to manage stack size for repeated cycles 
*/


module.exports.numAndHalfRandomizer = function(highest) {
  var num = Math.ceil(Math.random() * highest);
  var halfNum = Math.ceil(num / 2)
  return [num, halfNum];
};

// mock incoming songs
module.exports.createDailyPlaylists = function (dailyViewTotal) {
  var results = [];
  for (var i = 0; i < dailyViewTotal; i++) {
    var numsGen = module.exports.numAndHalfRandomizer(module.exports.playlistNumber);
    results.push({playlist_id: numsGen[0], genre_id: numsGen[1]});
  }
  return results;
};
