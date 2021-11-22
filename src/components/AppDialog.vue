<template>
  <v-dialog v-model="abrir" :width="ancho" scrollable persistent>
    <v-card>
      <v-card-title class="py-3">
        <span class="
            text-subtitle-1
            font-weight-bold
            texto--text
            d-flex
            justify-self-center
          "
          >{{ titulo }}</span
        >
        <v-spacer></v-spacer>
        <v-btn @click="$emit('cerrar')" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-2">
        <slot name="contenido"></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',

  props: {
    abrir: {
      type: Boolean,
      default: false,
    },

    ancho: {
      type: String,
      default: '450px',
    },

    titulo: {
      type: String,
      default: '',
    },
  },
};
</script>
