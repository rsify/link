const router = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({
	extended: true
}))

router.get('/has', require('./has'))
router.post('/new', require('./new'))
router.get('/resolve', require('./resolve'))
router.get('/stats', require('./stats'))

module.exports = router
