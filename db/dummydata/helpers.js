
module.exports.numAndHalfRandomizer = function(highest) {
  var num = Math.ceil(Math.random() * highest);
  var halfNum = Math.ceil(num / 2)
  return [num, halfNum];
};

module.exports.createDailyPlaylists = function (dailyViewTotal) {
  var results = [];
  for (var i = 0; i < dailyViewTotal; i++) {
    var numsGen = module.exports.numAndHalfRandomizer(20);
    results.push({playlist_id: numsGen[0], genre_id: numsGen[1]})
  }
  return results;
} 