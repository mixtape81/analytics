const Promise = require('bluebird');
const { createAndSavePlaylists } = require('./dummydata/index.js');
var { createDailySongs } = require('./dummydata/songHelpers.js');
var { saveSongs } = require('./controller.js');
const { pl_daily_views, playlist_id_metrics, song_daily_views } = require('./models.js');
const fs = require('fs'); 
const { testfile } = require('./constants.js')
 
let { TotalCycles, maxSavesPerRound, timeoutPerSave, timeoutData } = require('./dummydata/helpers.js'); 
let hour = 0;
let multiplier = 1;

// timeoutPerSave based on 50 playlists;
function timeoutCollectionInt(collector, func) {
  setTimeout(function () {
    collector = [];
    for (hour; hour < maxSavesPerRound * multiplier; hour++) {
      collector.push([func, hour]);
    }
    multiplier++;

    Promise.each(collector, (promise, index) => {
      promise[0](new Date(2017, 05, 01, promise[1]));
    })
    console.log('--new interval--')

    if (maxSavesPerRound * (multiplier - 1) < TotalCycles) {
      timeoutCollectionInt(hour.toString());
    }
  }, timeoutPerSave);
}
//timeoutCollectionInt(hour.toString(), createAndSavePlaylists);

var songsToSave = createDailySongs();
var timeoutinfo = timeoutData('songs');
maxSavesPerRound = timeoutinfo.maxSavesPerRound;
timeoutPerSave = timeoutinfo.timeoutPerSave;
hour = 0;
multiplier = 1;

function timeoutSongInt(collector, func, param) {
  setTimeout(function () {
    collector = [];

    for (hour; hour < maxSavesPerRound * multiplier; hour++) {
      collector.push([func, hour]);
    }
    multiplier++;
    Promise.each(collector, (promiseTuple, index) => {
      promiseTuple[0](param, new Date(2017, 05, 01, promiseTuple[1]));
    })
    console.log('--new interval--')

    if (maxSavesPerRound * (multiplier - 1) < TotalCycles) {
      timeoutSongInt(hour.toString(), saveSongs, songsToSave);
    }
  }, timeoutPerSave);
}
//timeoutSongInt(hour.toString(), saveSongs, songsToSave)




