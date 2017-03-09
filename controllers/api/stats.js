const Link = require('../../models/Link')
const Promise = require('promise')

module.exports = (req, res) => {
	const l = '1mI0HX'

	if (!l)
		return res.status(400).json({ err: 'l not specified' })

	const link = new Link(l)

	const g = function* () {
		const props = ['country', 'referer', 'browser', 'platform']
		let i = 0
		while (i < props.length) yield props[i++]
	}()

	const result = {}
	Promise.resolve(0).then(function loop (i) {
		let v = g.next()
		if (!v.done)
			return link.countClickGroup(v.value).then((props) => {
				result[v.value] = {}
				for (const prop of props)
					result[v.value][prop.group] = prop.reduction
			}).then(loop)
	}).then(() => {
		return res.json({
			err: null,
			success: true,
			res: result
		})
	}).catch((err) => {
		return res.status(500).json({ err: 'server error' })
	})
}
