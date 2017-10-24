//in psql, run 'create database spotifyanalytics'

module.exports = {
	client: 'pg',
	version: '7.6',
	connection: {
		host: '127.0.0.1',
		user: 'USER_NAME',
		password: 'IF_PASSWORD',
		database: 'spotifyAnalytics'
	}
}