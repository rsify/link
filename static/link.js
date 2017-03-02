var arr = ['start', 'loading', 'finish']

for (let c of arr) {
	Vue.component(c + '-view', {
		template: '#' + c + '-template'
	})
}

var vm = new Vue({
	el: '#app',
	template: '#app-template',
	computed: {
		linkOutputValue: function () {
			if (!this.lOutputValue) return ''
			else return window.location.origin + '/' + this.lOutputValue
		}
	},
	data: {
		currentView: 'start-view',
		lOutputValue: '',
		urlInputValue: ''
	},
	methods: {
		copylOutput: function () {
			// TODO
		},

		finished: function () {
			this.currentView = 'finish-view'
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

						that.lOutputValue = body.res.l
						if (!that.lOutputValue) throw 'l not received'

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
