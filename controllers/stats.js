const log = require('../util/log')
const Link = require('../models/Link')

module.exports = (req, res) => {
	if (typeof req.params.l === 'undefined')
		return res.redirect('/')

	Link.exists(req.params.l).then((exists) => {
		if (!exists) return res.redirect('/')

		const stats = {}
		const link = new Link(req.params.l)

		res.render('index')
	}).catch((err) => {
		log.error('routes', `caught error: ${err}`)
		res.redirect('/')
	})
}
