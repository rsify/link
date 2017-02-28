const Promise = require('promise')
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

		console.log(click)

		return new Promise((resolve, reject) => {
			db.table('links').get(this.l).update({
				clicks: db.row('clicks').append(click)
			}).run(db.conn).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	create (url) {
		const data = {
			l: this.l,
			url: url,
			clicks: []
		}

		return new Promise((resolve, reject) => {
			db.table('links').insert(data).run(db.conn).then((res) => {
				if (res.errors > 0)
					reject(res.first_error)
				else
					resolve()
			}).catch((err) => {
				reject(err)
			})
		})
	}

	get (prop) {
		return new Promise((resolve, reject) => {
			db.table('links').get(this.l)(prop).run(db.conn).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	static exists (l) {
		return new Promise((resolve, reject) => {
			db.table('links')('l').contains(l).run(db.conn).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
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
