<template>
  <v-row>
    <!-- Titulo -->
    <v-col cols="12">
      <h3 class="texto--text">Llaves</h3>
    </v-col>

    <!-- Filtros -->
    <v-col cols="12" class="mb-6 mt-2">
      <form @submit.prevent="inicio()">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Nombre"
              v-model="filtros.alias"
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
          :items="llaves"
          class="texto--text"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-all-text': 'Todos',
            pageText: '{0}-{1} de {2}',
          }"
        >
          <!-- Fecha de creación -->
          <template v-slot:[`item.created_at`]="{ item }">
            {{ moment(item.created_at).format('DD/MM/YYYY') }}
          </template>

          <!-- Boton de estatus -->
          <template v-slot:[`item.habilitado`]="{ item }">
            <v-layout justify-center>
              <v-switch
                v-model="item.habilitado"
                color="success"
                @change="habilitar(item.id, item.habilitado)"
                inset
              ></v-switch>
            </v-layout>
          </template>

          <!-- Boton de acciones -->
          <template v-slot:[`item.eliminar`]="{ item }">
            <v-btn @click="confirmarEliminar(item.id)" color="secondary" icon>
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>

          <!-- Sin datos en la tabla -->
          <template v-slot:no-data>
            <span>Sin llaves</span>
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
      :titulo="form.id ? 'Modificar alias' : 'Nueva llave'"
      :abrir="dialog"
      @cerrar="dialog = false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardar()">
          <v-row class="mt-2" dense>
            <v-col cols="12">
              <span class="texto--text">Alias</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.alias"
                placeholder="Alias de la llave"
                autocomplete="off"
                :error-messages="error.alias"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="text-center mt-5">
              <v-btn color="primary" type="submit" :loading="cargando" rounded>
                Guardar
              </v-btn>
            </v-col>

          </v-row>
        </form>
      </template>
    </app-dialog>

    <!-- Eliminar llave -->
    <app-dialog
      titulo="Eliminar llave"
      :abrir="dialogDelete"
      @cerrar="dialogDelete = false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="eliminar()">
          <v-row class="mt-2" dense>
            <v-col cols="12">
              <span class="texto--text">
                Confirma el eliminado ingresando el alias de la llave.
              </span>
              <v-text-field
                v-model="alias"
                placeholder="Alias de la llave"
                autocomplete="off"
                :error-messages="error.alias"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="text-center mt-5">
              <v-btn color="error" type="submit" :loading="cargando" rounded>
                Confirmar eliminado
              </v-btn>
            </v-col>

          </v-row>
        </form>
      </template>
    </app-dialog>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex';
import AppDialog from '@/components/AppDialog.vue';
import funciones from '@/mixins/funciones';
import errorsResponse from '@/mixins/response';

const formInit = {
  alias: null,
};

export default {
  name: 'Llaves',

  components: { AppDialog },

  mixins: [funciones, errorsResponse],

  data() {
    return {
      tabla: [
        { text: 'ID', align: 'center', value: 'id' },
        { text: 'Alias', value: 'alias' },
        { text: 'Key', align: 'center', value: 'key' },
        { text: 'Creado', align: 'center', value: 'created_at' },
        { text: 'Habilitado', align: 'center', value: 'habilitado' },
        { text: 'Eliminar', align: 'center', value: 'eliminar' },
      ],
      filtros: {
        alias: null,
      },
      llaves: [],
      alias: null,
      idKey: null,
      dialog: false,
      dialogDelete: false,
      form: this.clonar(formInit),
      error: [],
      cargando: false,
      desactivado: false,
    };
  },

  created() {
    this.inicio();
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR']),

    inicio() {
      this.desactivado = true;
      this.CHANGE_OVERLAY(true);

      this.axios
        .get('/validation_keys', { params: this.filtros })
        .then(({ data }) => {
          this.llaves = data;
        })
        .catch((error) => {
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
            this.desactivado = false;
          }, 300);
        });
    },

    editar(idLlave) {
      this.form = this.clonar(formInit);
      this.error = [];

      this.axios
        .get(`validation_keys/${idLlave}`)
        .then(({ data }) => {
          this.form = this.asignar(this.form, data);
          this.dialog = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    guardar() {
      this.cargando = true;
      this.error = [];

      const isNew = this.form.id === undefined;
      const method = isNew ? 'post' : 'put';
      const edit = `/${this.form.id}`;
      const url = `validation_keys${isNew ? '' : edit}`;

      if (this.form.activo === null) {
        this.form.activo = 0;
      }

      this.axios({ method, url, data: this.form })
        .then(() => {
          this.inicio();
          this.dialog = false;
          this.form = this.clonar(formInit);
          this.ACTIVATE_SNACKBAR({
            text: isNew ? 'Llave creada' : 'Se han guardado los cambios',
            color: 'success',
          });
        })
        .catch((error) => {
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.cargando = false;
          }, 500);
        });
    },

    habilitar(id, value) {
      this.CHANGE_OVERLAY(true);

      this.axios
        .put(`/validation_keys/${id}`, { habilitado: value })
        .then(() => {
          this.inicio();
          this.ACTIVATE_SNACKBAR({
            text: 'Cambio el estado de la llave.',
            color: 'success',
          });
        })
        .catch((error) => {
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
          }, 300);
        });
    },

    confirmarEliminar(id) {
      this.error = [];
      this.alias = null;
      this.dialogDelete = true;
      this.idKey = id;
    },

    eliminar() {
      this.CHANGE_OVERLAY(true);

      this.axios
        .delete(`/validation_keys/${this.idKey}`, { params: { alias: this.alias } })
        .then(() => {
          this.dialogDelete = false;
          this.idKey = null;
          this.inicio();
          this.ACTIVATE_SNACKBAR({
            text: 'Se ha eliminado la llave',
            color: 'success',
          });
        })
        .catch((error) => {
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
          }, 300);
        });
    },

    abrirDialog() {
      this.form = this.clonar(formInit);
      this.dialog = true;
      this.error = [];
    },

  },
};
</script>
