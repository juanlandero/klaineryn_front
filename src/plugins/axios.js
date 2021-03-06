import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_URL_BASE;

axios.interceptors.request.use((configs) => {
  const config = configs;
  const user = JSON.parse(window.localStorage.getItem('user_app')) || null;

  if (user) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }

  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 401 && error.response.data.message === 'Unauthenticated.') {
    localStorage.removeItem('user_app');
  }

  return Promise.reject(error);
});

export default axios;
