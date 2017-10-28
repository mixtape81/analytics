const Promise = require('bluebird');
const { createAndSavePlaylists } = require('./dummydata/index.js');
var { createDailySongs } = require('./dummydata/songHelpers.js');
var { saveSongs } = require('./controller.js');

const { TotalCycles, maxSavesPerRound, timeoutPerSave } = require('./dummydata/helpers.js'); 


let hour = 0;
let multiplier = 1;
//based on 50 playlists;

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



  //replicate promise every hour, and insert;
  
  //for each playlist
    //for each song
      //pust song in
  
  // 200 playlists 
  // 30 songs each
  // 6000 saves a cycle + 200 saves of parent per songs;
  //6000 * 2160 = 12million 
var songsToSave = createDailySongs();
console.log(new Date(2017, 05, 01, 1).getFullYear())
//saveSongs(songsToSave)













