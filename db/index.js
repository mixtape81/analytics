const Promise = require('bluebird');
var dummy = require('./dummydata/index.js');
var dummySongs = require('./dummydata/songs.js');
const { TotalCycles, maxSavesPerRound, timeoutPerSave } = require('./dummydata/helpers.js'); 

let hour = 0;
let multiplier = 1;

//based on 50 playlists;

function timeoutCollectionInt(collector) {
  setTimeout(function () {
    collector = [];

    for (hour; hour < maxSavesPerRound * multiplier; hour++) {
      collector.push([dummy, hour]);
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
timeoutCollectionInt(hour.toString());






/*
function grabDummy() {
	return new Promise((resolve, reject) => {
    return resolve(dummy);
	})
}
function timeoutSetter(func, time) {
	console.log('intime', func)
	return setTimeout(() => func.then((hello) => {console.log('hi', hello)}), time)
}
trigger = 10;
function resolver(fun) {
  trigger--;
  return new Promise((resolve, reject) => {
  	if (trigger) {
  		console.log(fun())
      return resolve(timeoutSetter(resolver(fun), 100))
    }
  })
};
function resolveAfter(milli, promise) {
	return new Promise((resolve, reject) => {
		return setTimeout(() => {
			resolve(promise)
		}, milli);
	})
	.catch(err => reject(err));
};
async function promiseWaiter(milli, promise) {
	return await resolveAfter(milli, promise);
};
*/







