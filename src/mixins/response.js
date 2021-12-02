export default {
  methods: {
    errorsResponse(response) {
      const { status, data } = response;

      switch (status) {
        case 400:
          this.ACTIVATE_SNACKBAR({
            text: data.message,
            color: 'error',
          });
          break;

        case 401:
          this.ACTIVATE_SNACKBAR({
            text: 'Su sesión ha caducado',
            color: 'error',
          });
          break;

        case 422:
          this.ACTIVATE_SNACKBAR({
            text: 'Favor de verificar los datos ingresados',
            color: 'error',
          });
          this.error = data.errors;
          break;

        default:
          this.ACTIVATE_SNACKBAR({
            text: data.message ? data.message : 'Error en aplicación',
            color: 'error',
          });
          break;
      }
    },
  },
};
