const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { pl_daily_views: dailyViews } = require('../db/models.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//('/playlistviews')''
app.use('/', (req, res) => {
  console.log('hello');
});



//[{playlist_id: 1}, {playlist_id: 2}]


app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

