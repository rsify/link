// fills an existing link with random click data
//
// takes an l as a command line param

const db = require('../db')
const Link = require('../models/Link')

if (!process.argv[2]) throw 'l not specified'

const randIP = () => {
	let arr = [], i = 4
	while (i--)	arr.push(Math.ceil(Math.random() * 254))
	return arr.join('.')
}

const pick = (...arr) => arr[Math.floor(Math.random() * arr.length)]

db.events.on('ready', () => {
	const link = new Link(process.argv[2])

	let i = 100
	const f = () => {
		return link.addClick({
			country: pick('Chad', 'Kuwait', 'Croatia', 'Ukraine', 'unknown'),
			referer: pick('facebook.com', 'twitter.com', 'unknown'),
			browser: pick('Chrome', 'Firefox', 'Opera', 'unknown'),
			platform: pick('Linux', 'Windows', 'macOS', 'unknown'),
			ip: randIP()
		}).then(() => {
			console.log(`added some data, (i: ${i})`)
			if (--i) f()
			else process.exit(0)
		})
	}

	f()
})

