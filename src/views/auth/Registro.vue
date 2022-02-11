<template>
  <v-card
    class="rounded-lg animate__animated animate__fadeIn"
    :class="animacion"
    elevation="24"
  >
    <v-card-title class="justify-center d-flex flex-column">
      <span class="text-h4 primary--text font-weight-regular">Registro</span>
      <p class="text-caption texto--text">Ingresa tus datos para crear una cuenta</p>
    </v-card-title>

    <v-card-text class="pt-1 px-6">
      <form @submit.prevent="guardar">
        <v-text-field
          placeholder="Nombre"
          prepend-inner-icon="mdi-account-outline"
          autocomplete="off"
          v-model="form.nombre"
          :error-messages="errors.nombre"
          :disabled="boton.bloqueado"
          outlined
        ></v-text-field>

        <v-text-field
          placeholder="Correo electrónico"
          prepend-inner-icon="mdi-email-outline"
          autocomplete="off"
          v-model="form.email"
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
          v-model="form.password"
          :error-messages="errors.password"
          @click:append="show = !show"
          :disabled="boton.bloqueado"
          outlined
        ></v-text-field>

        <v-text-field
          placeholder="Confirmar contraseña"
          prepend-inner-icon="mdi-key-outline"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show2 ? 'text' : 'password'"
          autocomplete="off"
          v-model="form.password_confirmation"
          :error-messages="match_password"
          @click:append="show2 = !show2"
          :disabled="boton.bloqueado"
          outlined
        ></v-text-field>

        <v-btn
          color="primary"
          type="submit"
          :loading="boton.cargando"
          depressed
          large
          block
        >Registrarte</v-btn>
        <p class="mt-6 text-center">
          ¿Ya tienes una cuenta?
          <a @click="mostrarAnimacion">Inicia sesión</a>
        </p>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import botones from '@/mixins/funciones';
import errorsResponse from '@/mixins/response';

export default {
  name: 'Registro',

  mixins: [botones, errorsResponse],

  data() {
    return {
      form: {
        nombre: null,
        email: null,
        password: null,
        password_confirmation: null,
      },
      errors: [],
      boton: {
        cargando: false,
        bloqueado: false,
      },
      show: false,
      show2: false,
      cargando: false,
      desabilitado: false,
      animacion: null,
    };
  },

  computed: {
    ...mapGetters(['snackbar']),

    match_password() {
      if (this.form.password_confirmation !== null) {
        if (this.form.password !== this.form.password_confirmation) {
          return 'Las contraseñas no coinciden';
        }
      }
      return null;
    },
  },

  methods: {
    ...mapMutations(['ACTIVATE_SNACKBAR']),

    guardar() {
      this.botones(true);
      this.cargando = true;
      this.errors = [];

      this.axios
        .post('/auth/register', this.form)
        .then(() => {
          this.$router.replace({ name: 'login' });
          this.ACTIVATE_SNACKBAR({
            text: 'Hemos enviado un correo para la activación de su cuenta.',
            color: 'info',
          });
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
        this.$router.push({ name: 'login' });
      }, 500);
    },
  },
};
</script>
