import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from '@/views/layout/Main.vue';
import Login from '@/views/login/Login.vue';

import Inicio from '@/views/Inicio.vue';
// Administración
import Permisos from '@/views/administracion/Permisos.vue';
import Roles from '@/views/administracion/Roles.vue';
import Usuarios from '@/views/administracion/Usuarios.vue';
// Tests
import Test from '@/views/test/Test.vue';

Vue.use(VueRouter);

const routes = [
  // login
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'full',
    },
  },

  {
    path: '',
    meta: { requiresAuth: true },
    component: Main,
    children: [
      {
        path: '/',
        name: 'inicio',
        component: Inicio,
      },

      // Administraciòn
      {
        path: '/administracion/permisos',
        name: 'admin-permisos',
        component: Permisos,
      },
      {
        path: '/administracion/roles',
        name: 'admin-roles',
        component: Roles,
      },
      {
        path: '/administracion/usuarios',
        name: 'admin-usuarios',
        component: Usuarios,
      },
      // Ruta de test
      {
        path: '/test',
        name: 'test-uno',
        component: Test,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('user_app')) {
    next({ name: 'login' });
  }
  next();
});

export default router;
