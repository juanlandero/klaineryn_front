<template>
  <v-card
    class="rounded-lg animate__animated animate__fadeIn"
    :class="animacion"
    elevation="24"
  >
    <v-card-title class="justify-center d-flex flex-column">
      <span class="text-h4 primary--text font-weight-regular">Iniciar Sesión</span>
      <p class="text-caption texto--text">Inicia sesión para administrar tu cuenta</p>
    </v-card-title>

    <v-card-text class="pt-1 pb-3 px-6">
      <form @submit.prevent="login">
        <v-text-field
          placeholder="Correo electrónico"
          prepend-inner-icon="mdi-email-outline"
          autocomplete="off"
          v-model="user.email"
          :error-messages="errors.email"
          :disabled="boton.bloqueado"
          outlined
        ></v-text-field>

        <v-text-field
          placeholder="Contraseña"
          prepend-inner-icon="mdi-key-outline"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          autocomplete="off"
          v-model="user.password"
          :error-messages="errors.password"
          @click:append="show = !show"
          :disabled="boton.bloqueado"
          outlined
        ></v-text-field>

        <v-btn
          color="primary"
          type="submit"
          :bloqueado="boton.bloqueado"
          class="mt-4"
          large
          block
          depressed
          :loading="cargando"
        >Iniciar sesión</v-btn>

        <p class="mt-10 text-center">
          ¿Aun no estas registrado?
          <a @click="mostrarAnimacion">Registrarme</a>
        </p>
        <p class="text-center">
          <a @click="abrirDialog">Olvide mi contraseña</a>
        </p>
      </form>
    </v-card-text>

    <app-dialog
      titulo="Recuperar contraseña"
      :abrir="dialog"
      @cerrar="dialog=false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardar()">
          <v-row class="mt-2" dense>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                placeholder="Escribe el correo de tu cuenta"
                autocomplete="off"
                :error-messages="errors.email"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="text-center mt-5">
              <v-btn color="primary" type="submit" :loading="cargando">
                Guardar
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </template>
    </app-dialog>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import botones from '@/mixins/funciones';
import errorsResponse from '@/mixins/response';
import AppDialog from '@/components/AppDialog.vue';

export default {
  name: 'Login',

  components: { AppDialog },

  mixins: [botones, errorsResponse],

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
      animacion: null,
      dialog: false,
      email: null,
    };
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
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.botones(false);
            this.cargando = false;
          }, 350);
        });
    },
    mostrarAnimacion() {
      this.animacion = 'animate__fadeOut';
      setTimeout(() => {
        this.$router.push({ name: 'registro' });
      }, 500);
    },
    abrirDialog() {
      this.email = null;
      this.dialog = true;
      this.error = [];
    },
  },
};
</script>
