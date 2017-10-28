module.exports.maximizeStack = 20000;

module.exports.playlistNumber = 200;

module.exports.TotalCycles = 2160; // hours: 2160

module.exports.dailyViewTotal = module.exports.TotalCycles * module.exports.playlistNumber * 20;

module.exports.maxSavesPerRound = 20000 / module.exports.playlistNumber;
module.exports.timeoutPerSave = module.exports.maxSavesPerRound * module.exports.playlistNumber * 2.8; // milliseconds;


module.exports.numAndHalfRandomizer = function(highest) {
  var num = Math.ceil(Math.random() * highest);
  var halfNum = Math.ceil(num / 2)
  return [num, halfNum];
};

module.exports.createDailyPlaylists = function (dailyViewTotal) {
  var results = [];
  for (var i = 0; i < dailyViewTotal; i++) {
    var numsGen = module.exports.numAndHalfRandomizer(module.exports.playlistNumber);
    results.push({playlist_id: numsGen[0], genre_id: numsGen[1]});
  }
  return results;
};



