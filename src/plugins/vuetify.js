import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#00BDEB',
        secondary: '#010417',
        accent: '#EB7100',
        error: colors.red.darken4,
        warning: colors.yellow,
        success: colors.green,
        info: colors.blue,
        texto: '#5E5873',
        bgcolor: '#ECEFF1',
        bgcard: '#fff',
        bglogin: '#f8fafb',
      },
      // {
      //   primary: '#3BA0AD',
      //   secondary: '#E063A3',
      //   accent: '#E0CD36',
      //   error: colors.red.darken4,
      //   warning: colors.yellow,
      //   success: colors.green,
      //   info: colors.blue,
      //   texto: '#5E5873',
      //   bgcolor: '#ECEFF1',
      //   bgcard: '#fff',
      //   bglogin: '#f8fafb',
      // },
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
