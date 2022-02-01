import Vue from 'vue';
import moment from 'moment';
import Vue2Filters from 'vue2-filters';
import VueApexCharts from 'vue-apexcharts';
import animate from 'animate.css';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from './plugins/axios';

const vue2Config = {
  currency: {
    symbol: '$',
    decimalDigits: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbolOnLeft: true,
    spaceBetweenAmountAndSymbol: true,
    showPlusSign: false,
  },
  number: {
    format: '0,0.00',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
};

Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.moment = moment;
Vue.use(Vue2Filters, vue2Config);
Vue.use(VueApexCharts);
Vue.use(animate);
Vue.component('apexchart', VueApexCharts);

moment.locale('es');

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
