import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.cyan.lighten2,
        secondary: colors.red,
        accent: colors.lightBlue.lighten1,
        error: colors.red.darken4,
        warning: colors.yellow,
        success: colors.green,
        info: colors.blue,
        texto: '#5E5873',
        bgcolor: '#ECEFF1',
        bgcard: '#fff',
      },
      dark: {
        primary: colors.red,
        secondary: colors.indigo,
        accent: colors.lime,
        error: colors.red,
        warning: colors.yellow,
        success: colors.green,
        info: colors.blue,
        texto: colors.grey,
      },
    },
  },
});
