<template>
  <!-- <v-row
    style="height: 100vh; width: 100vw; margin: 0"
  > -->
  <v-div>
    <v-app-bar
      elevation="0"
      class="transparent px-md-7 px-sm-5"
    >
      <!-- <v-img src="@/assets/icono_negro.png" max-height="60" max-width="60"></v-img> -->
      <v-img src="@/assets/icono.png" max-height="60" max-width="60"></v-img>
      <!-- <v-img src="@/assets/logo_horizontal.png" max-height="60" max-width="160"></v-img> -->
      <v-spacer></v-spacer>
        <v-btn
          class="text-capitalize d-none d-sm-flex"
          color="accent"
          @click="preciosDialog = true"
          rounded
          plain
        >
          Nosotros
        </v-btn>
        <v-btn
          class="text-capitalize d-none d-sm-flex mx-5"
          color="accent"
          @click="servicioDialog = true"
          rounded
          plain
        >
          Servicio
        </v-btn>
        <v-btn class="text-capitalize d-none d-sm-flex" color="accent" rounded plain>
          Precios
        </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="4" sm="6" class="align-self-center px-xs-16">
          <p class="text-h3">
            La mejor forma de <span class="primary--text">validar</span> tus facturas.
          </p>
          <p class="texto--text mb-3">
            Verifica que tus facturas se encuentren registradas en el SAT con solo
            leer un código QR o ingresando los datos manualmente.
          </p>
          <v-col class="text-center">
            <v-btn class="text-capitalize px-10" color="accent" rounded large>Contáctanos</v-btn>
          </v-col>
        </v-col>

        <v-col cols="12" md="4" sm="6" class="align-self-center">
          <v-img src="@/assets/logo.png" width="1000" contain></v-img>
        </v-col>

        <v-col cols="12" md="4" sm="7" class="align-self-center mt-sm-10">
          <v-list-item>
            <v-list-item-icon>
              <v-btn class="accent" rounded>
                <v-icon>mdi-qrcode-scan</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Validación por QR</v-list-item-title>
              <p class="texto--text">Escanee el código QR de su factura</p>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="my-7">
            <v-list-item-icon>
              <v-btn class="accent" rounded>
                <v-icon>mdi-gesture-tap</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Validación manual</v-list-item-title>
              <p class="texto--text">
                Ingrese los datos de su factura para realizar la validación
              </p>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-btn class="accent" rounded>
                <v-icon>mdi-clipboard-text-clock-outline</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Historial</v-list-item-title>
              <p class="texto--text">Guarde sus validaciones realizadas</p>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>

      <v-row class="my-10 text-center">
        <v-col class="text-h3">Paquetes de validaciones</v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="pa-5" elevation="2">
            <p class="text-h6">Paquete 1</p>
            <p class="text-body-2 texto--text">Este paquete contiene 1</p>
            
          </v-card>
        </v-col>
        <v-col>
          <v-card
            elevation="2"
          >2</v-card>
        </v-col>
        <v-col>
          <v-card
            elevation="2"
          >2</v-card>
        </v-col>
        <v-col>
          <v-card
            elevation="2"
          >2</v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialogs -->
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="600"
      v-model="preciosDialog"
    >
      <template v-slot:default="preciosDialog">
        <v-card>
          <v-card-text>
            <div class="text-h2 pa-12">Hello world!</div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="preciosDialog = false"
            >Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <app-dialog
      titulo="Agregar Saldo"
      :abrir="servicioDialog"
      @cerrar="servicioDialog = false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardarSaldo">
          <v-row class="mt-2" dense>
            <v-col cols="6">
              <span class="texto--text">Saldo</span>
              <span class="error--text"> *</span>
              <v-text-field
                placeholder="Cantidad"
                autocomplete="off"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="text-center mt-5">
              <v-btn color="primary" type="submit" :loading="cargando">
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </template>
    </app-dialog>
  <!-- </v-row> -->
  </v-div>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue';

export default {
  name: 'LandingPage',

  components: { AppDialog },

  data() {
    return {
      preciosDialog: false,
      servicioDialog: false,
    };
  },
};
</script>
