const Link = require('../../models/Link')

module.exports = (req, res) => {
	if (!req.query.l)
		return res.status(400).json({ err: 'url not specified' })

	const link = new Link(req.query.l)

	link.get('url').then((url) => {
		return res.json({
			err: null,
			success: true,
			res: url
		})
	}).catch((err) => {
		return res.status(500).json({ err: 'server error' })
	})
}
