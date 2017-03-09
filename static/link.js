var arr = ['start', 'loading', 'finish']

for (let c of arr) {
	Vue.component(c + '-view', {
		template: '#' + c + '-template'
	})
}

Vue.component('stats-view', {
	template: '#stats-template',
	data: function () {
		return {
			tabs: ['heck', 'planetLUL']
		}
	}
})

var initialData = {
	currentView: 'start-view',
	l: '',
	showStats: true,
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
				console.log('copy', s)
				if (!s) throw 'copy command failed'
				this.flashCopySuccessBubble()
			} catch (e) {
				console.log(e)
			}
		},

		finished: function () {
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
		},

		stats: function () {
			if (typeof this.l === 'undefined' && this.l.length === 0) return
			this.currentView = 'stats-view'

			var xhr = new XMLHttpRequest()
			xhr.open('GET', '/api/stats?l=' + this.l)
			xhr.addEventListener('load', function (res) {
				console.log('req', res.responseText)
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

			var that = this
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					try {
						var body = JSON.parse(xhr.responseText)

						that.l = body.res.l
						if (!that.l) throw 'l not received'

						that.finished()
					} catch (e) {
						console.log(e)
					}
				}
			}
		}
	},
	watch: {
		urlInputValue: function (val, old) {
			if (val.length > old.length + 1)
				this.submit()
		}
	}
})
