const router = require('express').Router()

router.get('/', (req, res) => {
	res.render('index')
})

router.get('/favicon.ico', (req, res) => {
	res.status(404).end()
})

router.use('/api', require('./api'))
router.get('/:l', require('./l'))

module.exports = router
