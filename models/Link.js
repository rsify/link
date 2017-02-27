const Promise = require('promise')
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
				reject(res)
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
}
