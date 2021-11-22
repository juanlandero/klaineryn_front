import Vue from 'vue';
import moment from 'moment';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from './plugins/axios';

Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.moment = moment;

moment.locale('es');

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
