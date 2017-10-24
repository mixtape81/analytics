const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { pl_daily_views: dailyViews } = require('../db/models.js');
const { condensePlaylists } = require('./helpers.js');
const { savePlaylists } = require('../db/controller.js');
const Promise = require('bluebird');
const dummy = require('./dummyData.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  console.log('hello');
});


//run this every day, request from user interactions
app.get('/playlistviews', (req, res) => {
	//chunk process ?
	//save incoming playlists 
	new Promise((resolve) => {
    //return req.body
    return resolve(dummy);
	})
	.then((incoming) => {
		console.log(incoming)
    return condensePlaylists(incoming.incomingPlaylists);
	}) 
	.then((playlistsToSave) => {
    return savePlaylists(playlistsToSave);
	})
  .then(() => res.json('successfully saved condensed playlists'))
  .catch((err) => res.json('error saving condensed playlists', err))
});


/*
//*do genre specific playlists get more plays on a given week than mixed-genre playlists



*/

module.exports.listening = app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

