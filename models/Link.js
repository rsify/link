const Promise = require('promise')
const UAParser = require('ua-parser-js')
const request = require('request')
const url = require('url')
const crypto = require('crypto')
const db = require('../db')

module.exports = class Link {
	constructor (l) {
		this.l = l
	}

	addClick (click) {
		click = click || {}
		const defaults = {
			unix: new Date().getTime(),
			country: 'unknown',
			referer: 'unknown',
			browser: 'unknown',
			platform: 'unknown',
			ip: 'unknown'
		}

		for (let d in defaults) {
			click[d] = click[d] || defaults[d]
		}

		return db.table('links').get(this.l).update({
				clicks: db.row('clicks').append(click)
			}).run(db.conn)
	}

	create (url) {
		const data = {
			l: this.l,
			url: url,
			clicks: []
		}

		return db.table('links').insert(data).run(db.conn).then((res) => {
			if (res.errors > 0)
				throw res.first_error

			return res
		})
	}

	get (prop) {
		return db.table('links').get(this.l)(prop).run(db.conn)
	}

	saveReq (req) {
		const click = {}

		const ua = req.headers['user-agent']
		if (ua) {
			click.ua = ua
			const parser = new UAParser()
			parser.setUA(ua)
			const r = parser.getResult()

			if (r.browser.name) click.browser = r.browser.name
			if (r.os.name) click.platform = r.os.name
		}

		const ref = req.headers['referer'] || req.headers['Referer'] || null
		if (ref) {
			const refURL = url.parse(req.headers['referer'])
			click.referer = refURL.hostname
		}

		if (req.ip && req.ip !== '::1') {
			click.ip = req.ip
			try {
				request('https://freegeoip.net/json/' + req.ip,
					(err, res, body) => {

					if (err) throw err

					const b = JSON.parse(b)
					click.location = b
					click.country = b.country_name

					this.addClick(click)
				})
			} catch (e) {
				console.log('something went wrong with processing click', click)
			}
		}
	}

	static exists (l) {
		return db.table('links')('l').contains(l).run(db.conn)
	}

	static genId () {
		const LEN = 6

		return new Promise((resolve, reject) => {
			const g = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
				'abcdefghijklmnopqrstuvwxyz0123456789'

			const f = () => {
				const l = Array.apply(null, Array(LEN)).map(() => {
					return g.charAt(Math.floor(Math.random() * g.length))
				}).join('')

				db.table('links').get(l).run(db.conn).then((res) => {
					if (res === null) resolve(l)
					else f()
				}).catch((err) => {
					reject(err)
				})
			}

			f()
		})
	}
}
