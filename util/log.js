const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const moment = require('moment')

const DIR = path.resolve(__dirname, '../logs/')

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR)

const stream = fs.createWriteStream(DIR + '/link.log', {
	flags: 'a'
})

const fsLog = (cat, msg) => {
	msg = chalk.stripColor(msg)
	stream.write(`(${moment().format('DD-MM-YYYY HH:MM')}) [${cat}] ${msg}\n`)
}

module.exports = {
	chalk: chalk,
	debug: (msg) => {
		console.log(chalk.bold(cat.toLowerCase()) + ' ' + msg)
	},
	// short for emphasize
	e: (msg) => {
		return chalk.bold(msg)
	},
	error: (cat, msg) => {
		console.log(chalk.bold.red(cat.toLowerCase()) + ' ' + msg)
		fsLog(cat, msg)
	},
	fatal: (cat, msg) => {
		console.log(chalk.bold.bgRed(cat.toLowerCase()) + ' ' + msg)
		fsLog(cat, msg)
	},
	info: (cat, msg) => {
		console.log(chalk.bold.blue(cat.toLowerCase()) + ' ' + msg)
		fsLog(cat, msg)
	},
	inspect: (object) => {
		console.dir(object, { color: true })
	},
	success: (cat, msg) => {
		console.log(chalk.bold.green(cat.toLowerCase()) + ' ' + msg)
		fsLog(cat, msg)
	}
}
