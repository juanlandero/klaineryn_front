<template>
  <v-col :cols="cols" :lg="lg" :sm="sm">
    <span class="texto--text">{{ label }}</span>
    <span class="error--text" v-if="requerido"> *</span>

    <v-autocomplete
      :label="labelIn"
      :placeholder="placeholder"
      v-model="seleccion"
      @change="seleccionarItem"
      :items="items"
      :item-value="valor"
      :item-text="texto"
      :error-messages="errorMessages"
      :hide-details="hideDetails"
      :no-data-text="nodata"
      :clearable="clearable"
      :multiple="multiple"
      :chips="chips"
      :disabled="desactivado"
      menu-props="offsetY"
      :rounded="rounded"
      outlined
      dense
    >
      <template v-slot:selection="data" v-if="chips">
        <v-chip
          color="primary"
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click="data.select"
          @click:close="remove(data.item)"
        >
          {{ data.item.nombre }}
        </v-chip>
      </template>
    </v-autocomplete>
  </v-col>
</template>

<script>
export default {
  name: 'AppAutocomplete',

  props: {
    cols: {
      type: String,
      default: '6',
    },
    lg: {
      type: String,
      default: '6',
    },
    sm: {
      type: String,
      default: '6',
    },

    labelIn: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },

    items: {
      type: [Array],
      default: () => [],
    },
    data: {
      type: [String, Number, Array, Boolean],
      default: '',
    },
    texto: {
      type: String,
      default: '',
    },
    valor: {
      type: String,
      default: '',
    },
    nodata: {
      type: String,
      default: 'Sin datos',
    },

    hideDetails: {
      type: Boolean,
      default: false,
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
    multiple: {
      type: Boolean,
      default: false,
    },
    chips: {
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
      seleccion: null,
    };
  },

  watch: {
    data() {
      this.checkData();
    },

    items() {
      this.checkData();
    },
  },

  mounted() {
    this.checkData();
  },

  methods: {
    seleccionarItem() {
      this.$emit('value', this.seleccion);
    },

    checkData() {
      const element = this.items.find((item) => item[this.valor] === this.data);
      if (element) {
        this.seleccion = element;
      } else {
        this.seleccion = null;
      }
    },

    remove(item) {
      const index = this.seleccion.indexOf(item.id);
      if (index >= 0) this.seleccion.splice(index, 1);
    },
  },
};
</script>
