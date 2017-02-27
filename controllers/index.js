const router = require('express').Router()

router.get('/', (req, res) => {
	res.render('index')
})

router.use('/api', require('./api'))
router.get('/:l', require('./l'))

module.exports = router
