const EventEmitter = require('events')
const r = require('rethinkdb')
const log = require('../util/log')
const config = require('../config')

const events = new EventEmitter()

r.connect({ host: config.r.host, port: config.r.port }).then((c) => {
	conn = c
	return r.dbList().contains(config.r.db).run(conn).then((res) => {
		if (!res) {
 			log.info('db', `database ${config.r.db} doesn't exist, creating...`)

			return r.dbCreate(config.r.db).run(conn)
		}
	})
}).then(() => {
	return r.db(config.r.db).tableList().contains('links').run(conn).then((res) => {
		if (!res) {
			log.ingo('db', 'table \'links\' doesn\'t exist, creating...')

			return r.db(config.r.db).tableCreate('links', {
				primaryKey: 'l'
			}).run(conn)
		}
	})
}).catch((err) => {
	throw err
}).done(() => {
	conn.use(config.r.db)
	module.exports.conn = conn

	log.success('db', 'database ready')
	events.emit('ready')
})

module.exports = r
module.exports.events = events
