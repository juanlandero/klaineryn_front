<template>
  <v-row mb-5>
    <!-- Titulo -->
    <v-col cols="12">
      <h3 class="texto--text">Roles</h3>
    </v-col>

    <!-- Filtros -->
    <v-col cols="12" class="mb-6 mt-2">
      <form @submit.prevent="inicio()">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Nombre del rol"
              v-model="filtros.nombre"
              hide-details
              clearable
              outlined
              rounded
              dense
            ></v-text-field>
          </v-col>

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
          :items="roles"
          class="texto--text"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-all-text': 'Todos',
            pageText: '{0}-{1} de {2}',
          }"
        >
          <!-- Boton de acciones -->
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn @click="editar(item.id)" color="secondary" icon>
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
          </template>

          <!-- Fecha creado -->
          <template v-slot:[`item.created_at`]="{ item }">
            {{ moment(item.created_at).format('DD/MM/YYYY') }}
          </template>

          <!-- Sin datos en la tabla -->
          <template v-slot:no-data>
            <span>Sin roles</span>
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
      :titulo="form.id ? 'Modificar Rol' : 'Nuevo Rol'"
      :abrir="dialog"
      @cerrar="dialog=false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardar()">
          <v-row class="mt-2" dense>
            <v-col cols="12">
              <span class="texto--text">Nombre</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.nombre"
                placeholder="Nombre"
                autocomplete="off"
                :error-messages="error.nombre"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-data-table
                :headers="[
                    { text: 'Permisos', align: 'center', value: 'nombre' },
                  ]"
                :items="obtPermisos"
                v-model="seleccionadoTabla"
                show-select
                class="texto--text"
                item-key="id"
                dense
                :footer-props="{
                  'items-per-page-text': 'Mostrando',
                  'items-per-page-all-text': 'Todos',
                  pageText: '{0}-{1} de {2}',
                }"
              >
                <!-- Sin datos en la tabla -->
                <template v-slot:no-data>
                  <span>Sin permisos</span>
                </template>
              </v-data-table>
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
import funciones from '@/mixins/funciones';

const formInit = {
  nombre: null,
  permisos: [],
};

export default {
  name: 'Roles',

  components: { AppDialog },

  mixins: [funciones],

  data() {
    return {
      tabla: [
        { text: 'ID', align: 'center', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Creado', align: 'center', value: 'created_at' },
        { text: 'Acciones', align: 'center', value: 'acciones' },
      ],
      filtros: {
        nombre: null,
      },
      roles: [],
      dialog: false,
      form: this.clonar(formInit),
      error: [],
      cargando: false,
      desactivado: false,
      seleccionadoTabla: [],
    };
  },

  created() {
    this.inicio();
    this.permisos();
  },

  computed: {
    ...mapGetters(['obtPermisos']),

    tablaFiltrados() {
      if (this.seleccionadoTabla && this.seleccionadoTabla.length) {
        return this.seleccionadoTabla.map((item) => item.id);
      }
      return [];
    },
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR']),
    ...mapActions(['permisos']),

    inicio() {
      this.desactivado = true;
      this.CHANGE_OVERLAY(true);

      this.axios
        .get('/administracion/roles', { params: this.filtros })
        .then((response) => {
          this.roles = response.data;
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
                text: 'Erro al iniciar sesión',
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

    editar(idRol) {
      this.form = this.clonar(formInit);
      this.errors = [];

      this.axios
        .get(`administracion/roles/${idRol}`)
        .then(({ data }) => {
          this.form = this.asignar(this.form, data);
          this.seleccionadoTabla = data.permisos;
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
      const url = `administracion/roles${isNew ? '' : edit}`;

      if (this.form.is_active === null) {
        this.form.is_active = 0;
      }

      this.form.permisos = this.tablaFiltrados;

      this.axios({ method, url, data: this.form })
        .then(() => {
          this.inicio();
          this.dialog = false;
          this.form = this.clonar(formInit);
          this.ACTIVATE_SNACKBAR({
            text: isNew ? 'Rol creado' : 'Se han guardado los cambios',
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
      this.seleccionadoTabla = [];
      this.dialog = true;
      this.errors = [];
    },
  },
};
</script>
