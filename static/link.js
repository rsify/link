var arr = ['start', 'loading', 'finish']

for (let c of arr) {
	Vue.component(c + '-component', {
		template: '#' + c + '-template'
	})
}

var vm = new Vue({
	el: '#app',
	template: '#app-template',
	data: {
		currentView: 'start-component'
	}
})
