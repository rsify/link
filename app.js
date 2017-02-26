const express = require('express')
const config = require('./config')

const app = express()

app.set('view engine', 'pug')

app.use('/', express.static('static'))
app.use('/', require('./controllers'))

const l = app.listen(config.http.port, () => {
	console.log(`listening on port ${l.address().port}`)
})
