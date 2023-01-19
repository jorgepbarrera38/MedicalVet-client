import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import toastr from 'toastr'
import vSelect from 'vue-select'
import Croppa from 'vue-croppa'
import VCalendar from 'v-calendar'

Vue.use(VCalendar, {
  //componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
})

Vue.component('pagination', require('laravel-vue-pagination'));

Vue.use(Croppa)       

Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css';

require('toastr/build/toastr.min.css')

axios.defaults.headers.common['authorization'] = 'bearer ' + localStorage.getItem('access_token')

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status == 401) {
    $('#exampleModal').modal('hide')
    $('#appointmentModal').modal('hide')
    $('#cancelAppointmentModal').modal('hide')
    localStorage.removeItem('access_token')
    localStorage.removeItem('names_user')
    localStorage.removeItem('name_user')
    localStorage.removeItem('permissions')

    let body = document.getElementsByTagName('body')[0]

    if (body.classList.contains('sidenav-toggled')) {
      document.getElementsByTagName('body')[0].classList.remove('sidenav-toggled')
    }

    router.push({ name: 'login' })
  }
  if (error.response.status == 403) {
    toastr.error('No tiene permisos para esta acción')
    //router.push({ name: 'dashboard.index' })
  }

  if (error.response.status == 404) {
    toastr.error('No se encontraron coincidencias')
    //router.push({ name: 'dashboard.index' })
  }

  return Promise.reject(error);
});

toastr.options = {
  "positionClass": "toast-bottom-right"
}

Vue.prototype.$toastr = toastr

let production = false

if (production) {
  axios.defaults.baseURL = '/api'
  Vue.prototype.$hostFiles = '/'
} else {
  axios.defaults.baseURL = 'http://localhost:8000/api'
  Vue.prototype.$hostFiles = 'http://localhost:8000/'
}


Vue.prototype.$http = axios

Vue.prototype.$limitedVersion = false

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
