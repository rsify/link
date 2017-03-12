var arr = ['start', 'loading', 'finish']

for (let c of arr) {
	Vue.component(c + '-view', {
		template: '#' + c + '-template'
	})
}

var brightnessFromString = function (str, base) {
	return (str.split('').reduce(function (sum, it) {
		return sum + it.charCodeAt(0) * 99
	}, 0) % 500 / 5) % 30
}

Vue.component('stats-view', {
	template: '#stats-template',
	data: function () {
		return {
			chart: null,
			tabs: [
				{
					name: 'Country',
					icon: 'globe'
				},
				{
					name: 'Referer',
					icon: 'external-link'
				},
				{
					name: 'Browser',
					icon: 'cloud'
				},
				{
					name: 'Platform',
					icon: 'laptop'
				}
			],
			type: 'browser'
		}
	},
	methods: {
		tabSelect: function (e) {
			var type = e.target.dataset.type.toLowerCase()
			if (type === this.type) return

			this.type = type
			this.updateChart(type)
		},

		updateChart: function (type) {
			type = type || this.type

			var d = this.$parent.retrievedStats[type]

			if (Object.keys(d).length === 0) {
				var ctx = this.chart.chart.ctx
				var canvas = this.chart.chart.canvas
				ctx.font = '48px serif'
				ctx.textAlign = 'center'
				ctx.fillText('no data', 0, 0)
				return
			}

			var arr = []
			for (var key in d) {
				var prop = d[key]

				arr.push({ key: key, value: prop })
			}

			arr.sort(function (left, right) {
				if (left.value > right.value) return -1
				else if (left.value < right.value) return 1
				else return 0
			})

			var MAX_BARS = 4
			var data = arr.map(function (item) {
				return item.value
			}).filter(function (item, index) {
				return index < MAX_BARS
			})

			var labels = arr.map(function (item) {
				return item.key
			}).filter(function (item, index) {
				return index < MAX_BARS
			})

			var otherValue = arr.reduce(function (acc, item, index) {
				if (index >= MAX_BARS) {
					console.log(index, item, item.value)
					return acc + item.value
					}
				else return 0
			}, 0)

			if (otherValue) {
				labels.push('Other')
				data.push(otherValue)
			}

			this.chart.data.labels = labels
			this.chart.data.datasets = [{
				data: data,
				backgroundColor: labels.map(function (item) {
					return `hsla(207, 95%, ${brightnessFromString(item)}%, 1)`
				})
			}]

			this.chart.update()
		}
	},
	mounted: function () {
		const labels = []

		Chart.plugins.register({
			afterDraw: function (chart) {
				if (chart.data.datasets.length === 0) {
					var ctx = chart.chart.ctx;
					chart.clear()

					ctx.save()
					ctx.textAlign = 'center'
					ctx.textBaseline = 'middle'
					ctx.font = '24px farsan'
					ctx.fillText('no data',
						chart.chart.width / 2,
						chart.chart.height / 2)
					ctx.restore()
				}
			}
		})
		Chart.defaults.global.legend.display = false
		this.chart = new Chart('chart', {
			type: 'bar',
			options: {
				legend: {
					display: false
				},
				scales: {
					xAxes: [{ display: false }],
					yAxes: [{
						stacked: true,
						gridLines: {
							display: false
						}
					}]
				}
			}
		})

		setTimeout(this.updateChart, 0)
	}
})

var initialData = {
	currentView: 'loading-view',
	l: '',
	urlInputValue: ''
}

var vm = new Vue({
	el: '#app',
	template: '#app-template',
	computed: {
		linkOutputValue: function () {
			if (!this.l) return ''
			else return window.location.origin + '/' + this.l
		}
	},
	data: function () { return JSON.parse(JSON.stringify(initialData)) },
	methods: {
		copylinkOutput: function () {
			var ca = document.querySelector('.copy-area')
			ca.value = this.linkOutputValue
			ca.select()

			try {
				var s = document.execCommand('copy')
				if (!s) throw 'copy command failed'
				this.flashCopySuccessBubble()
			} catch (e) {
				console.error(e)
			}
		},

		finish: function () {
			this.currentView = 'finish-view'
		},

		flashCopySuccessBubble: function () {
			var el = document.querySelector('.output-copy')
			if (!el) return

			el.classList.add('animation-flash-copied')

			setTimeout(function () {
				el.classList.remove('animation-flash-copied')
			}, 1500)
		},

		reset: function () {
			for (var index in initialData) {
				this[index] = initialData[index]
			}

			this.currentView = 'start-view'
		},

		stats: function () {
			if (typeof this.l === 'undefined' || this.l.length === 0) return
			this.currentView = 'loading-view'

			var xhr = new XMLHttpRequest()
			xhr.open('GET', '/api/stats?l=' + this.l)
			var self = this
			xhr.addEventListener('load', function () {
				try {
					var body = JSON.parse(this.responseText)

					self.retrievedStats = body.res

					self.currentView = 'stats-view'
				} catch (e) {
					console.error('error while getting stats')
				}
			})

			xhr.send()
		},

		submit: function () {
			if (this.urlInputValue.length === 0) return
			this.currentView = 'loading-view'

			var xhr = new XMLHttpRequest()
			xhr.open('POST', '/api/new')
			xhr.setRequestHeader('Content-type',
				'application/x-www-form-urlencoded')

			xhr.send('url=' + this.urlInputValue)

			var self = this
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					try {
						var body = JSON.parse(xhr.responseText)

						self.l = body.res.l
						if (!self.l) throw 'l not received'

						self.finish()
					} catch (e) {
						console.error(e)
					}
				}
			}
		}
	},
	mounted: function () {
		var re = /\/(.+)\/stats/
		if (re.test(window.location.pathname)) // is on /:/stats route
			try {
				this.l = re.exec(window.location.pathname)[1]
				this.stats()
			} catch (e) {
				console.error('error while retrieving stats')
				this.currentView = 'start-view'
			}
		else this.currentView = 'start-view'
	},
	watch: {
		currentView: function (val, old) {
			// pseudo router
			if (val === 'stats-view') {
				window.history.replaceState({}, document.title, '/' + this.l + '/stats')
			}
			else if (old === 'stats-view') {
				window.history.replaceState({}, document.title, '/')
			}
		},
		urlInputValue: function (val, old) {
			if (val.length > old.length + 1)
				this.submit()
		}
	}
})
