const config = require('./config.js');
let knex = require('knex')(config);
let bookshelf = require('bookshelf')(knex);
const { song_daily_views } = require('./models.js');
const { songRecommendation } = require('./controller');
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

function recommendSong(playlist_id) {
  FileMap().then(map => {
    return songRecommendation(playlist_id)
    .then(songs => {
      // look up the song in the map; 
      songs.forEach(song => {
        var prev;
        for (let last in map) {
          console.log(song.song_id)
          if (-1 * song.song_id >= -1 * last) {
            console.log(map[last].data[song.song_id]);
          }
          prev = last;
        }
        
      })
    })
  })
}
recommendSong(1);

/*
knex.raw(`select created_at from song_daily_views limit 2;`)
.then(res => res.rows.forEach(row => console.log( row.created_at)));

knex.raw(`select extract(epoch from created_at) from song_daily_views limit 2;`)
.then(res => res.rows.forEach(row => console.log(typeof row.date_part)));

knex.raw(`select Date(created_at) + "time"(created_at) from song_daily_views limit 2;`)
.then(res => res.rows.forEach(row => console.log(row['?column?'])));
*/

/*new Promise((resolve, reject) => {
  return knex.schema.createTableIfNotExists('song_daily_views', function(table) {
    table.increments().primary();
    table.integer('song_id');
    table.integer('playlist_id').references('playlist_id_metrics.playlist_id');
    table.integer('views');
    table.integer('skips');
    table.integer('genre_id');
    table.timestamps();
  })
  .then(results => {
  	resolve(results);
  })
  .catch(err => reject(err));
})
.then(() => console.log('song_daily_views table created'));*/

