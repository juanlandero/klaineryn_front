<template>
  <v-row>
    <!-- Titulo -->
    <v-col cols="12">
      <h3 class="texto--text">Planes</h3>
    </v-col>

    <!-- Filtros -->
    <v-col cols="12" class="mb-6 mt-2">
      <form @submit.prevent="inicio()">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Nombre"
              v-model="filtros.nombre"
              hide-details
              clearable
              outlined
              rounded
              dense
            ></v-text-field>
          </v-col>
          <app-autocomplete
            label-in="Estatus"
            :items="[
              {id: null, texto: 'Todos'},
              {id: '1', texto: 'Activo'},
              {id: '0', texto: 'Inactivo'},
            ]"
            valor="id"
            texto="texto"
            :data="filtros.activo"
            @value="filtros.activo = $event"
            :rounded="true"
            cols="12"
            lg="3"
            sm="3"
          />

          <v-col align="right">
            <v-btn type="submit" color="primary" :disabled="desactivado" rounded>
              <v-icon left>mdi-magnify</v-icon>
              Buscar
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-col>

    <!-- Tabla -->
    <v-col cols="12" class="mb-6">
      <v-card class="pa-6 rounded-lg">
        <v-data-table
          :headers="tabla"
          :items="planes"
          class="texto--text"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-all-text': 'Todos',
            pageText: '{0}-{1} de {2}',
          }"
        >
          <!-- Formato de monto -->
          <template v-slot:[`item.monto`]="{ item }">
            <span>{{ item.monto | currency }}</span>
          </template>

          <!-- Formato de porcentaje de descuento -->
          <template v-slot:[`item.descuento_porcentaje`]="{ item }">
            <span>{{ item.descuento_porcentaje | percent }}</span>
          </template>

          <!-- Formato de monto de descuento -->
          <template v-slot:[`item.descuento_monto`]="{ item }">
            <span>{{ item.descuento_monto ? item.descuento_monto:0 | currency }}</span>
          </template>

          <!-- Fecha de creación -->
          <template v-slot:[`item.created_at`]="{ item }">
            {{ moment(item.created_at).format('DD/MM/YYYY') }}
          </template>

          <!-- Boton de estatus -->
          <template v-slot:[`item.activo`]="{ item }">
            <v-layout justify-center>
              <v-switch
                v-model="item.activo"
                color="success"
                disabled
                inset
              ></v-switch>
            </v-layout>
          </template>

          <!-- Boton de acciones -->
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn @click="editar(item.id)" color="secondary" icon>
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
          </template>

          <!-- Sin datos en la tabla -->
          <template v-slot:no-data>
            <span>Sin planes</span>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <!-- Botón agregar -->
    <v-btn
      color="primary"
      elevation="2"
      bottom
      right
      fixed
      fab
      @click="abrirDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Agregar/Editar -->
    <app-dialog
      :titulo="form.id ? 'Modificar Planes' : 'Nuevo Plan'"
      :abrir="dialog"
      @cerrar="dialog = false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardar()">
          <v-row class="mt-2" dense>
            <v-col cols="12">
              <span class="texto--text">Plan</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.nombre"
                placeholder="Nombre del plan"
                autocomplete="off"
                :error-messages="error.nombre"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <app-autocomplete
              label="Tipo de plan"
              placeholder="Selecciona un tipo de plan"
              :items="obtPlanesTipo"
              valor="id"
              texto="nombre"
              :data="form.planes_tipo_id"
              @value="form.planes_tipo_id = $event"
              :error-messages="error.planes_tipo_id"
              nodata="Sin tipos de planes"
              :rounded="true"
              requerido
              cols="12"
              lg="12"
              sm="12"
            />

            <v-col cols="12">
              <span class="texto--text">Monto</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.monto"
                placeholder="Precio del plan"
                autocomplete="off"
                :error-messages="error.monto"
                prefix="$"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <span class="texto--text">Porcentaje de descuento</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="descuento_porcentaje"
                placeholder="Porcentaje de descuento"
                autocomplete="off"
                :error-messages="error.descuento_porcentaje"
                suffix="%"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <span class="texto--text">Monto de descuento</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.descuento_monto"
                placeholder="Monto de descuento"
                autocomplete="off"
                :error-messages="error.descuento_monto"
                prefix="$"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-checkbox
                v-model="form.activo"
                label="Activo"
                color="accent"
                :value="true"
                hide-details
              ></v-checkbox>
            </v-col>

            <v-col cols="12" class="text-center mt-5">
              <v-btn color="primary" type="submit" :loading="cargando">
                Guardar
              </v-btn>
            </v-col>

          </v-row>
        </form>
      </template>
    </app-dialog>
  </v-row>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import AppDialog from '@/components/AppDialog.vue';
import AppAutocomplete from '@/components/AppAutocomplete.vue';
import funciones from '@/mixins/funciones';

const formInit = {
  nombre: null,
  planes_tipo_id: null,
  monto: null,
  descuento_porcentaje: null,
  descuento_monto: null,
  activo: null,
};

export default {
  name: 'Planes',

  components: { AppDialog, AppAutocomplete },

  mixins: [funciones],

  data() {
    return {
      tabla: [
        { text: 'ID', align: 'center', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Tipo plan', value: 'tipo_plan.nombre' },
        { text: 'Monto', align: 'center', value: 'monto' },
        { text: 'Porcentaje de descuento', align: 'center', value: 'descuento_porcentaje' },
        { text: 'Monto de descuento', align: 'center', value: 'descuento_monto' },
        { text: 'Creado', align: 'center', value: 'created_at' },
        { text: 'Activo', align: 'center', value: 'activo' },
        { text: 'Acciones', align: 'center', value: 'acciones' },
      ],
      filtros: {
        nombre: null,
        email: null,
        activo: null,
      },
      planes: [],
      dialog: false,
      form: this.clonar(formInit),
      descuento_porcentaje: null,
      error: [],
      show: false,
      show2: false,
      cargando: false,
      desactivado: false,
    };
  },

  created() {
    this.inicio();
    this.roles();
    this.planesTipo();
  },

  computed: {
    ...mapGetters(['obtPlanesTipo']),
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR']),
    ...mapActions(['roles', 'planesTipo']),

    inicio() {
      this.desactivado = true;
      this.CHANGE_OVERLAY(true);

      this.axios
        .get('/planes/planes', { params: this.filtros })
        .then(({ data }) => {
          this.planes = data.data;
        })
        .catch((error) => {
          switch (error.response.status) {
            case 400:
              this.ACTIVATE_SNACKBAR({
                text: error.response.data.message,
                color: 'error',
              });
              break;

            case 422:
              this.ACTIVATE_SNACKBAR({
                text: 'Datos invalidos',
                color: 'error',
              });
              this.setErrors(error.response.data.errors);
              break;

            default:
              this.ACTIVATE_SNACKBAR({
                text: 'Erro al cargar los datos',
                color: 'error',
              });
              break;
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
            this.desactivado = false;
          }, 300);
        });
    },

    editar(idPlan) {
      this.form = this.clonar(formInit);
      this.errors = [];

      this.axios
        .get(`planes/planes/${idPlan}`)
        .then(({ data }) => {
          this.form = this.asignar(this.form, data.data);
          this.dialog = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    guardar() {
      this.cargando = true;
      this.errors = [];

      const isNew = this.form.id === undefined;
      const method = isNew ? 'post' : 'put';
      const edit = `/${this.form.id}`;
      const url = `planes/planes${isNew ? '' : edit}`;

      if (this.form.activo === null) {
        this.form.activo = 0;
      }

      this.axios({ method, url, data: this.form })
        .then(() => {
          this.inicio();
          this.dialog = false;
          this.form = this.clonar(formInit);
          this.ACTIVATE_SNACKBAR({
            text: isNew ? 'Plan creado' : 'Se han guardado los cambios',
            color: 'success',
          });
        })
        .catch((error) => {
          switch (error.response.status) {
            case 400:
              this.ACTIVATE_SNACKBAR({
                text: error.response.data.message,
                color: 'error',
              });
              break;
            case 422:
              this.ACTIVATE_SNACKBAR({
                text: 'Favor de verificar los datos ingresados',
                color: 'error',
              });
              this.error = error.response.data.errors;
              break;
            default:
              this.ACTIVATE_SNACKBAR({
                text: 'Error al guardar',
                color: 'error',
              });
              break;
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.cargando = false;
          }, 500);
        });
    },

    abrirDialog() {
      this.form = this.clonar(formInit);
      this.dialog = true;
      this.errors = [];
    },

  },
};
</script>
