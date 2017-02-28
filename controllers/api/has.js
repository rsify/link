const Link = require('../../models/Link')

module.exports = (req, res) => {
	if (!req.query.l)
		return res.status(400).json({ err: 'l not specified' })

	Link.exists(req.query.l).then((exists) => {
		return res.json({
			err: null,
			success: true,
			res: exists
		})
	}).catch((err) => {
		return res.status(500).json({ err: 'server errror' })
	})
}
