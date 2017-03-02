const Link = require('../../models/Link')

module.exports = (req, res) => {
	const l = req.query.l || req.body.l

	if (!l)
		return res.status(400).json({ err: 'url not specified' })

	const link = new Link(l)

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
