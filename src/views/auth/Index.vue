<template>
  <v-row
    class="bglogin"
    style="height: 100vh; margin: 0"
  >
    <!-- Banner -->
    <v-banner
      v-model="banner.visible"
      width="100%"
      max-height="65"
      single-line
      outlinexd
    >
      <v-avatar
        slot="icon"
        :color="banner.color"
        size="40"
      >
        <v-icon
          color="white"
        >
          {{ banner.icon }}
        </v-icon>
      </v-avatar>

      {{ banner.text }}

      <template v-slot:actions>
        <v-btn
          color="secondary"
          @click="CLOSE_BANNER"
          text
        >
          Cerrar
        </v-btn>
      </template>
    </v-banner>

    <!-- Logo -->
    <!-- <v-col cols="12" class="error">
      <v-btn plain color="primary">Test</v-btn>
      <v-img src="@/assets/place_logo.png" alt="Place"></v-img>
    </v-col> -->
    <!-- Sección izquierda -->
    <v-col class="d-none d-sm-flex" cols="12" md="6" lg="6">
      <v-row class="justify-center er2ror">
        <v-col class="align-self-center" cols="10">
          <v-row>
            <p class="text-h4 texto--text">
              <span class="primary--text">Bienvenido</span>, es un gusto tenerte aquí de nuevo.
            </p>
          </v-row>

          <!-- <v-img
            src="@/assets/login.svg"
          ></v-img> -->
        </v-col>
      </v-row>
    </v-col>

    <!-- Sección derecha -->
    <v-col class="d-flex" cols="12" md="6" lg="6" sm="8">
      <v-row class="justify-center prim2ary">
        <v-col cols="12" md="9" class="align-self-center">
          <router-view></router-view>
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
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'IniciarSesion',

  computed: {
    ...mapGetters(['snackbar', 'banner']),
  },

  methods: {
    ...mapMutations(['CLOSE_BANNER']),
  },
};
</script>
