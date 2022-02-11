<template>
  <v-row
    class="bglogin"
    style="height: 100vh; margin: 0"
  >
    <!-- Logo -->
    <!-- <v-col cols="12" class="error">
      <v-btn plain color="primary">Test</v-btn>
      <v-img src="@/assets/place_logo.png" alt="Place"></v-img>
    </v-col> -->
    <!-- Sección izquierda -->
    <v-col cols="12" md="6" lg="6" class="bldue">
      <v-row class="justify-center">
        <v-col cols="10" class="erros">
          <v-row class="greemn3 mb-4">
            <p class="text-h4 texto--text">
              <span class="primary--text">{{ $route.params.tipo }}</span>
            </p>
          </v-row>

          <v-img
            src="@/assets/login.svg"
          ></v-img>
        </v-col>
      </v-row>
    </v-col>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.open" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
// import Login from '@/views/login/Login.vue';
// import Registro from '@/views/login/Registro.vue';

export default {
  name: 'Activación',

  // components: { Login, Registro },

  data() {
    return {
      change_card: true,
    };
  },

  computed: {
    ...mapGetters(['snackbar']),
  },
};
</script>
