const Link = require('../models/Link')

module.exports = (req, res) => {
	if (typeof req.params.l === 'undefined')
		return res.redirect('/')

	Link.exists(req.params.l).then((exists) => {
		if (!exists) return res.redirect('/')

		const link = new Link(req.params.l)

		link.get('url').then((url) => {
			const re = /^https?:\/\//
			if (!re.test(url))
				url = 'http://' + url

			res.redirect(301, url)
		}).catch((err) => {
			res.redirect('/')
		})
	})
}
