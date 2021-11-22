<template>
  <v-app>
    <!-- SideBar -->
    <v-navigation-drawer v-model="drawer" app>
      <div class="px-8 py-6">
        <!-- <v-img
          src="@/assets/logo.png"
          width="192px"
        ></v-img> -->
      </div>

      <v-divider></v-divider>

      <app-menu-list-items
        :datos="obtMenu"
        color="secondary"
      ></app-menu-list-items>
    </v-navigation-drawer>

    <!-- App bar -->
    <v-app-bar
      color="primary"
      dense
      app>
      <v-btn
        @click.stop="drawer = !drawer"
        rounded
        text
      >
        <v-icon color="white">mdi-menu</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- User button -->
      <v-menu class="d-inline" offset-y bottom left >
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="white--text text-capitalize" v-bind="attrs" v-on="on" rounded text>
            <v-icon class="pr-2">mdi-account</v-icon>
            {{ obtUser.nombre }}
          </v-btn>
        </template>

        <v-list rounded dense nav>
          <v-list-item>
            <v-list-item-title v-text="obtUser.email"></v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
            <v-list-item @click="logout">
              <v-list-item-title>Cerrar sesión</v-list-item-title>
            </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main -->
    <v-main class="bgcolor">
      <v-container>
        <router-view class="mt-2"></router-view>
      </v-container>
    </v-main>

    <!-- Overlay -->
    <v-snackbar v-model="snackbar.open" :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn @click="CLOSE_SNACKBAR" v-bind="attrs" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular
        color="accent"
        size="100"
        width="7"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AppMenuListItems from '@/components/AppMenuListItems.vue';

export default {
  name: 'App',

  components: { AppMenuListItems },

  data() {
    return {
      drawer: true,
      activo: null,
    };
  },

  mounted() {
    this.menu();
    this.user();
  },

  computed: {
    ...mapGetters(['overlay', 'snackbar', 'obtMenu', 'obtUser']),
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR', 'CLOSE_SNACKBAR']),
    ...mapActions(['user', 'menu']),

    logout() {
      this.CHANGE_OVERLAY(true);

      this.axios
        .post('/auth/logout')
        .then(() => {
          localStorage.removeItem('user_app');
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
            this.$router.replace({ name: 'login' });
          }, 350);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
