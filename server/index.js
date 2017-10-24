const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { pl_daily_views: dailyViews } = require('../db/models.js');
const { condensePlaylists } = require('./helpers.js');
const { savePlaylists } = require('../db/controller.js');
const Promise = require('bluebird');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', (req, res) => {
  console.log('hello');
});

app.get('userinteractions/playlistviews', (req, res) => {
	//chunk process ?
	//save incoming playlists 
  
	new Promise((resolve, reject) => {
    return req.body
	})
	.then((incomingPlaylists) => {
    return condensePlaylists(incomingPlaylists);
	}) 
	.then((playlistsToSave) => {
    return savePlaylists(playlistsToSave);
	})
	.then(() => resolve(), () => reject());

});


/*
//*do genre specific playlists get more plays on a given week than mixed-genre playlists



*/

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

