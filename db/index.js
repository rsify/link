const config = require('../config')

const r = require('rethinkdb')

let conn
r.connect({ host: config.r.host, port: config.r.port }).then((c) => {
	conn = c
	return r.dbList().contains(config.r.db).run(conn).then((res) => {
		if (!res) {
 			console.log(`database ${config.r.db} doesn't exist, creating...`)

			return r.dbCreate(config.r.db).run(conn)
		}
	})
}).then(() => {
	return r.db(config.r.db).tableList().contains('links').run(conn).then((res) => {
		if (!res) {
			console.log('table links doesn\'t exist, creating...')

			return r.db(config.r.db).tableCreate('links').run(conn)
		}
	})
}).catch((err) => {
	throw err
}).done(() => {
	conn.use(config.r.db)
	module.exports.conn = conn
})
