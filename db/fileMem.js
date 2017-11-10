const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);
const { song_daily_views } = require('./models.js');
const { songHistoryPretty } = require('./controller');
const Promise = require('bluebird');
const { testfile } = require('./constants.js');
const fs = require('fs');
const _ = require('lodash');
var stream = fs.createWriteStream('./testJson.json');

function updateHash(fetchCount, offset, fileName) {
  return new Promise((resolve, reject) => {
    // check if the file exists
    fs.exists(__dirname + fileName, (exists) => {
      if (exists) {
        fs.readFile(__dirname + fileName, (err, data) => {
          if (err) {
            reject(err);
          } else {
            data = data.toString('utf-8');
            data ? data = JSON.parse(data) : data = {};
            let time = offset.toString().slice(0, 1);
            resolve(data);
          }
        });
      } else {
        fs.openSync(__dirname + fileName, 'w'); // create file
        resolve({});
      }
    })
  })
  .then(hash => {
    return new Promise((resolve, reject) => {
      song_daily_views.orderBy('songs', fetchCount, offset)
      .then(songs => {
        if (!songs) {
          reject('fetch error');
        }
        songs.rows.forEach(row => {
          if (hash[row.song_id]) {
            hash[row.song_id].views += row.views;
            hash[row.song_id].skips += row.skips;
          } else { 
            hash[row.song_id] = {
              views: row.views,
              skips: row.skips
            }
          }
        });
        songs = null;
        resolve(hash);
      });
    })
  })
  .then((hash) => {
    return fs.writeFile(__dirname + fileName, JSON.stringify(hash), (err) => {
      if (err) {
        console.log('err', err)
      }
      hash = null;
    });
  });
}


function createSignature(iterable) {  
  return Math.ceil((iterable + 1) / 4);
}
function nameJsonFile(base, signature) {
  return [base, signature, '.json'].join('');
}
function intDivide(historyCount, maxFetch) {
  return Math.floor(historyCount / maxFetch);
}
function fileSigList(totalFiles) {
  let files = [];
  for (let fileSig = 1; fileSig <= totalFiles; fileSig++) {
    files.push(fileSig);
  }
  return files;
}
function asyncCountSongQueries(maxFetch) {
  // may be refactored to count other tables;
  return song_daily_views.count()
  .then(historyCount => {
    return intDivide(historyCount, maxFetch)
  });
}
const maxFetch = 1000000;


function condenseSongHistory(targetFileBase) {
  let offset = 0;
  var promises = []; 
  asyncCountSongQueries(maxFetch)
  .then(queryCount => {

    for (let i = 0; i <= queryCount; i++) {
      promises.push({
          fn: updateHash, 
          fetchCount: maxFetch, 
          offset: offset, 
          file: nameJsonFile(targetFileBase, createSignature(i))
        });
      offset += maxFetch;
    }
    Promise.mapSeries(promises, args => {
      return Promise.delay(4000) 
      .then(() => {
        console.log(new Date(), args);
        return args.fn(args.fetchCount, args.offset, args.file);
      })
    });
  })
  .then(() => {
    let files = fileSigList(createSignature(queryCount));
    files.pop();

    Promise.each(files, fileSig => {
      var firstSong;
      var lastSong;
      return new Promise((resolve, reject) => {
        fs.readFile(__dirname + nameJsonFile(targetFileBase, fileSig), (err, data1) => {
          if (err) {
            reject(err);
          }
          data1 = JSON.parse(data1);
          lastSong = 0;
          _.each(data1, (metrics, song_id) => {
            ~~song_id > lastSong ? lastSong = ~~song_id : null;
          });

          fs.readFile(__dirname + nameJsonFile(targetFileBase, fileSig + 1), (err, data2) => {
            if (err) {
              reject(err);
            }
            data2 = JSON.parse(data2);
            firstSong = Infinity;
            _.each(data2, (metics, song_id) => {
              ~~song_id < firstSong ? firstSong = ~~song_id : null;
            });

            if (firstSong === lastSong) {
              data2[firstSong].views += data1[lastSong].views;
              data2[firstSong].skips += data2[lastSong].skips;
              delete data1[lastSong];

              fs.writeFile(__dirname + nameJsonFile(targetFileBase, fileSig), JSON.stringify(data1), (err) => {
                if (err) {
                  reject(err);
                }
                fs.writeFile(__dirname + nameJsonFile(targetFileBase, fileSig + 1), JSON.stringify(data2), err => {
                  if (err) {
                    reject(err);
                  }
                  resolve('updated files')
                })
              })
            }
          });
        });
      })
      .then(result => {
        console.log(result)
      });
    });
  });
}
// list of file signatures: fileSigList(createSignature(totalFiles));
function asyncDataInFile(targetFileBase = '/testJson', fileSig = 1) {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + nameJsonFile(targetFileBase, fileSig), (err, data) => {
      if (err) {
        reject(err);
      }
      data = JSON.parse(data);
      let lastSong = 0;
      let firstSong = Infinity;
      _.each(data, (metrics, song_id) => {
        ~~song_id > lastSong ? lastSong = ~~song_id : null;
        ~~song_id < firstSong ? firstSong = ~~song_id : null;
      });
      var results = {};
      results[fileSig] = {};
      results[fileSig].data = data;
      results[fileSig].first = firstSong;
      results[fileSig].last = lastSong;
      resolve(results);
    });
  });
}
function asyncLintLastFirst(targetFileBase = '/testJson', maxFetch = 1000000) {
  asyncCountSongQueries(maxFetch)
  .then(totalFiles => {
    let fileList = fileSigList(createSignature(totalFiles));
    fileList.pop();
    Promise.mapSeries(fileList, fileSig => {
      let firstFile = asyncDataInFile(targetFileBase, fileSig);
      let secondFile = asyncDataInFile(targetFileBase, fileSig + 1);

      return Promise.all([firstFile, secondFile])
      .then((results) => {
        let firstFile = results[0][fileSig];
        let secondFile = results[1][fileSig + 1];
        if (firstFile.last === secondFile.first) {
          secondFile.data[secondFile.first].views += firstFile.data[firstFile.last].views;
          secondFile.data[secondFile.first].skips += firstFile.data[firstFile.last].skips;
          delete firstFile.data[firstFile.last];
          fs.writeFile(__dirname + nameJsonFile(targetFileBase, fileSig), firstFile.data, (err) => {
            if (err) {
              throw err;
            }
            fs.writeFile(__dirname + nameJsonFile(targetFileBase, fileSig + 1), secondFile.data, (err) => {
              if (err) {
                throw err;
              }
            });
          });
        }
      });
    });
  });
}
//asyncLintLastFirst()

async function FileMap(maxFetch = 1000000) {
  var results = {};
  return asyncCountSongQueries(maxFetch)
  .then((totalSongs) => {
    let fileList = fileSigList(createSignature(totalSongs));
    return Promise.map(fileList, fileSig => {
      return asyncDataInFile('/testJson', fileSig)
      .then(data => {
        results[data[fileSig].last] = {fileSig: fileSig, data: data[fileSig].data};
      });
    });
  }).then(() => results);
}

function viewSkipMetrics(FileMap, playlist_id) {
  return Promise.resolve(FileMap === 'function' ? FileMap() : FileMap)
  .then(map => {
    return songHistoryPretty(playlist_id)
    .then(songs => {
      var views = {};
      views.most = 0;
      views.least = Infinity;
      var skips = {};
      skips.most = 0;
      skips.least = Infinity;

      songs.forEach(song => {
        for (let last in map) {
          if (-1 * song.song_id >= -1 * last) {
            songData = map[last].data[song.song_id]
            if (songData) {
              if (songData.views > views.most) {
                views.most = songData.views;
                views.mostID = song.song_id;
              } else if (songData.views < views.least) {
                views.least = songData.views;
                views.leastID = song.song_id;
              }
              if (songData.skips > skips.most) {
                skips.most = songData.skips;
                skips.mostID = song.song_id;
              } else if (songData.skips < skips.least) {
                skips.least = songData.skips;
                skips.leastID = song.song_id;
              }
            }
          }
        }   
      });
      return Promise.resolve({
        viewMetrics: views,
        skipMetrics: skips
      });
    })
  })
}
console.log(new Date())
// takes 4 minutes;
async function findHighestMetricsAllPlaylists(totalPlaylists = 200) {
  return FileMap()
  .then((map) => {
    var ids = [];
    for (var playlist_id = 1; playlist_id <= totalPlaylists; playlist_id++) {
      ids.push(playlist_id);
    }
    return Promise.mapSeries(ids, (playlist_id) => {
      return viewSkipMetrics(map, playlist_id)
    })
    .then(playlists => {
      console.log(playlists)
    })
  })
}
findHighestMetricsAllPlaylists().then(() => console.log(new Date()))
