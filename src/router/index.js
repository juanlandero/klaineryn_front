import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from '@/views/layout/Main.vue';
import IniciarSesion from '@/views/login/Index.vue';
import Login from '@/views/login/Login.vue';
import Registro from '@/views/login/Registro.vue';

import Inicio from '@/views/Inicio.vue';
// Administración
import Permisos from '@/views/administracion/Permisos.vue';
import Roles from '@/views/administracion/Roles.vue';
import Usuarios from '@/views/administracion/Usuarios.vue';
// Planes
import Planes from '@/views/planes/Planes.vue';
import PreciosPlanes from '@/views/precios/PreciosPlanes.vue';
// Validaciones
import Validaciones from '@/views/validaciones/Validaciones.vue';
// Desarrollador
import Llaves from '@/views/desarrollador/Llaves.vue';
// Tests
import Test from '@/views/test/Test.vue';

Vue.use(VueRouter);

const routes = [
  // login
  {
    path: '/iniciar-sesion',
    component: IniciarSesion,
    meta: {
      layout: 'full',
      requiresAuth: false,
    },
    children: [
      { path: '', component: Login, name: 'login' },
      { path: 'registro', component: Registro, name: 'registro' },
    ],
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
      // Ruta de planes
      {
        path: '/planes',
        name: 'planes-index',
        component: Planes,
      },
      {
        path: '/precios-planes',
        name: 'precios-planes-index',
        component: PreciosPlanes,
      },
      // Ruta de validaciones
      {
        path: '/desarrollador/llaves',
        name: 'llaves-index',
        component: Llaves,
      },
      // Ruta de llaves
      {
        path: '/validaciones',
        name: 'validaciones-index',
        component: Validaciones,
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
  if (
    to.matched.some((record) => record.meta.requiresAuth)
    && (!localStorage.getItem('user_app') || localStorage.getItem('user_app') === 'null')
  ) {
    // this route requires Auth, check if logged in
    // if not, redirect to login page.
    window.console.log('Not authenticated');

    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
