const Link = require('../../models/Link')

module.exports = (req, res) => {
	const l = req.query.l || req.body.l

	if (!l)
		return res.status(400).json({ err: 'l not specified' })

	Link.exists(l).then((exists) => {
		return res.json({
			err: null,
			success: true,
			res: exists
		})
	}).catch((err) => {
		return res.status(500).json({ err: 'server errror' })
	})
}
