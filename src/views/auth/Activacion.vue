<template>
  <v-row
    class="bglogin"
    style="height: 100vh; margin: 0"
  >
    <v-overlay value="true">
      <v-progress-circular
        color="accent"
        size="100"
        width="7"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>

export default {
  name: 'Activación',

  created() {
    localStorage.setItem('user_status', JSON.stringify(this.$route.params.estatus));
    this.$router.replace({ name: 'login' });
  },
};
</script>
