import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    overlay: false,
    snackbar: {
      open: false,
      text: 'snackbar',
      timeout: 2500,
      color: 'primary',
    },

    user: [],
    menu: [],
    roles: [],
    permisosPadre: [],
    permisos: [],
    planesTipos: [],
  },
  mutations: {
    CHANGE_OVERLAY(state, statusOverlay) {
      state.overlay = statusOverlay;
    },

    ACTIVATE_SNACKBAR(state, snackbar) {
      state.snackbar.open = true;
      state.snackbar.text = snackbar.text;
      state.snackbar.color = snackbar.color;
    },

    CLOSE_SNACKBAR(state) {
      state.snackbar.open = false;
    },

    SET_USER(state, user) {
      state.user = user;
    },

    SET_MENU(state, menu) {
      state.menu = menu;
    },

    SET_ROLES(state, roles) {
      state.roles = roles;
    },

    SET_PERMISOS_PADRE(state, permisosPadre) {
      state.permisosPadre = permisosPadre;
    },

    SET_PERMISOS(state, permisos) {
      state.permisos = permisos;
    },

    SET_PLANES_TIPO(state, planesTipo) {
      state.planesTipos = planesTipo;
    },
  },
  actions: {
    user({ commit }) {
      axios
        .post('/auth/user')
        .then((response) => {
          commit('SET_USER', response.data);
        })
        .catch(console.log);
    },

    menu({ commit }) {
      axios
        .get('/administracion/menu')
        .then((response) => {
          commit('SET_MENU', response.data.secciones);
        })
        .catch(console.log);
    },

    roles({ commit }) {
      axios
        .get('/administracion/roles')
        .then((response) => {
          commit('SET_ROLES', response.data);
        })
        .catch(console.log);
    },

    permisosPadre({ commit }) {
      axios
        .get('/administracion/permisos', {
          params: {
            acl_permiso_tipo_id: 1,
            activo: 1,
          },
        })
        .then((response) => {
          commit('SET_PERMISOS_PADRE', response.data);
        })
        .catch(console.log);
    },

    permisos({ commit }) {
      axios
        .get('/administracion/permisos')
        .then((response) => {
          commit('SET_PERMISOS', response.data);
        })
        .catch(console.log);
    },

    planesTipo({ commit }) {
      axios
        .get('/planes/planes_tipos')
        .then(({ data }) => {
          commit('SET_PLANES_TIPO', data.data);
        })
        .catch(console.log);
    },
  },
  getters: {
    overlay(state) {
      return state.overlay;
    },

    snackbar(state) {
      return state.snackbar;
    },

    obtUser(state) {
      return state.user;
    },

    obtMenu(state) {
      return state.menu;
    },

    obtRoles(state) {
      return state.roles;
    },

    obtPermisosPadre(state) {
      return state.permisosPadre;
    },

    obtPermisos(state) {
      return state.permisos;
    },

    obtPlanesTipo(state) {
      return state.planesTipos;
    },
  },
  modules: {
  },
});
