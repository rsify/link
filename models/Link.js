const Promise = require('promise')
const db = require('../db')

module.exports = class Link {
	constructor (opts) {
		this.opts = opts
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
