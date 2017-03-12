const compression = require('compression')
const express = require('express')
const log = require('./util/log')

log.info('app', 'starting...')

if (!require('fs').existsSync('config.json')) {
	log.fatal('app', `copy ${log.e('config.example.json')} ` +
		`to ${log.e('config.json')} before running the app`)

	process.exit(1)
}

const config = require('./config')

log.success('app', `read ${log.e('config.json')}`)

const app = express()

app.set('view engine', 'pug')
app.use(compression()) // gzip compress

app.locals.env = process.env

if (process.env.NODE_ENV && process.env.NODE_ENV === 'PRODUCTION')
	log.info('app', `started in ${log.e('production')} mode`)
else
	log.info('app', `started in ${log.e('development')} mode`)

app.use('/', express.static('static'))
app.use('/', require('./controllers'))

const l = app.listen(config.http.port, () => {
	log.success('http', 'server started')
	log.info('http', `server listening on port ${log.e(l.address().port)}`)
})
