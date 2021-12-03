<template>
  <v-col :cols="cols" :lg="lg" :sm="sm">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      :nudge-top="-45"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <span class="texto--text">
          {{ label }}
          <span class="error--text" v-if="requerido"> *</span>
        </span>

        <v-text-field
          v-model="fecha"
          v-bind="attrs"
          v-on="on"
          :placeholder="placeholder"
          :clearable="clearable"
          :rounded="rounded"
          autocomplete="off"
          :error-messages="errorMessages"
          outlined
          readonly
          dense
        ></v-text-field>
      </template>

      <v-date-picker
        v-model="fecha"
        no-title
        locale="es"
        @input="menu = false"
        @change="seleccionarFecha()"
      ></v-date-picker>
    </v-menu>
  </v-col>
</template>

<script>
export default {
  name: 'AppDatePicker',

  props: {
    cols: {
      type: Number,
      default: 6,
    },
    lg: {
      type: Number,
      default: 6,
    },
    sm: {
      type: Number,
      default: 6,
    },

    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },

    data: {
      type: String,
      default: null,
    },

    errorMessages: {
      type: [String, Array],
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    requerido: {
      type: Boolean,
      default: false,
    },
    desactivado: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      fecha: null,
      menu: false,
    };
  },

  watch: {
    data() {
      this.setData();
    },
  },

  mounted() {
    this.setData();
  },

  methods: {
    seleccionarFecha() {
      this.$emit('value', this.fecha);
    },

    setData() {
      this.fecha = this.data;
    },
  },
};
</script>
