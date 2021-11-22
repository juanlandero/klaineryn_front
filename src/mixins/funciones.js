export default {
  methods: {
    botones(estado) {
      this.boton.bloqueado = estado;
      this.boton.cargando = estado;
    },

    clonar(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    asignar(form, obj) {
      return Object.assign(form, obj);
    },

    // mapear(campos, objetoPrincipal, objetoSecundario) {
    //   campos.map((campo) => {
    //     objetoPrincipal[campo] = objetoSecundario[campo];
    //   });
    // },

    verificarVacio(item) {
      if (item) {
        return item;
      }
      return '';
    },

    $buildFormData(formData, data, parentKey) {
      if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach((key) => {
          this.$buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
      } else {
        const value = data == null ? '' : data;
        formData.append(parentKey, value);
      }
    },

    $jsonToFormData(data) {
      const formData = new FormData();
      this.$buildFormData(formData, data);
      return formData;
    },

    $clonar(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },
};
