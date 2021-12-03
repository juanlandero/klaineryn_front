<template>
  <v-row
    class="justify-center d-flex align-center bgcolor"
    style="height: 100vh; margin: 0"
  >
    <v-col cols="12" md="6" lg="4" sm="8">
      <v-row class="justify-center mb-16">
        <v-col cols="9">
          <!-- <v-img src="@/assets/place_logo.png" alt="Place"></v-img> -->
        </v-col>
      </v-row>
      <v-card>
        <v-progress-linear
          :active="cargando"
          indeterminate
          color="accent"
        ></v-progress-linear>

        <v-card-title class="justify-center d-flex flex-column">
          <span class="text-h4 secondary--text font-weight-regular"
            >Bienvenido</span
          >
          <p class="text-caption stcolor--text">Inicia sesión en tu cuenta</p>
        </v-card-title>

        <v-card-text class="pt-1 pb-3">
          <form @submit.prevent="login">
            <v-text-field
              color="white"
              label="email"
              prepend-inner-icon="mdi-account"
              autocomplete="off"
              v-model="user.email"
              :error-messages="errors.email"
              solo-inverted
              autofocus
            ></v-text-field>

            <v-text-field
              color="white"
              label="Contraseña"
              prepend-inner-icon="mdi-lock"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              autocomplete="off"
              v-model="user.password"
              :error-messages="errors.password"
              @click:append="show = !show"
              solo-inverted
            ></v-text-field>

            <v-btn
              color="secondary"
              elevation="2"
              type="submit"
              :bloqueado="boton.bloqueado"
              depressed
              large
              block
              >Iniciar sesión</v-btn
            >
          </form>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.open" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-row>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import boton from '@/mixins/funciones';
import errorResponse from '@/mixins/response';

export default {
  name: 'Login',

  mixins: [boton, errorResponse],

  data() {
    return {
      user: {
        email: null,
        password: null,
      },
      errors: [],
      boton: {
        cargando: false,
        bloqueado: false,
      },
      show: false,
      cargando: false,
    };
  },

  computed: {
    ...mapGetters(['snackbar']),
  },

  methods: {
    ...mapMutations(['ACTIVATE_SNACKBAR']),

    login() {
      this.botones(true);
      this.cargando = true;
      this.errors = [];

      this.axios
        .post('/auth/login', this.user)
        .then((response) => {
          localStorage.setItem('user_app', JSON.stringify(response.data.data));
          this.$router.replace({ name: 'inicio' });
        })
        .catch((error) => {
          this.errorResponse(error.response);
        })
        .finally(() => {
          this.botones(false);
          this.cargando = false;
        });
    },
  },
};
</script>
