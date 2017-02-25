const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.use('/', express.static('static'))
app.use('/', require('./controllers'))

const l = app.listen(3000, () => {
	console.log(`listening on port ${l.address().port}`)
})
