const express = require('express')

if (!require('fs').existsSync('config.json')) {
	console.log('copy config.example.json to config.json before running app.js')
	process.exit(1)
}

const config = require('./config')

const app = express()

app.set('view engine', 'pug')

app.use('/', express.static('static'))
app.use('/', require('./controllers'))

const l = app.listen(config.http.port, () => {
	console.log(`listening on port ${l.address().port}`)
})
