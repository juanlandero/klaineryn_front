<template>
  <v-row>
    <!-- Titulo -->
    <v-col cols="12">
      <h3 class="texto--text">Permisos</h3>
    </v-col>

    <!-- Filtros -->
    <v-col cols="12" class="mb-6 mt-2">
      <form @submit.prevent="inicio()">
        <v-row dense>
          <v-col cols="12" lg="3" sm="3">
            <v-text-field
              label="Nombre del permiso"
              v-model="filtros.nombre"
              clearable
              outlined
              rounded
              dense
            ></v-text-field>
          </v-col>

          <app-autocomplete
            label-in="Permisos de"
            :items="obtPermisosPadre"
            valor="id"
            texto="nombre"
            :data="filtros.acl_permiso_padre_id"
            @value="filtros.acl_permiso_padre_id = $event"
            :rounded="true"
            clearable
            cols="12"
            lg="2"
            sm="3"
          />

          <app-autocomplete
            label-in="Tipo de permiso"
            :items="[
              { id: 1, texto: 'Menu'},
              { id: 2, texto: 'Submenu'},
              { id: 3, texto: 'Acción'},
            ]"
            valor="id"
            texto="texto"
            :data="filtros.acl_permiso_tipo_id"
            @value="filtros.acl_permiso_tipo_id = $event"
            :rounded="true"
            clearable
            cols="12"
            lg="2"
            sm="3"
          />

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
            clearable
            cols="12"
            lg="2"
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
          :items="permisos"
          class="texto--text"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-all-text': 'Todos',
            pageText: '{0}-{1} de {2}',
          }"
        >
          <!-- Icono -->
          <template v-slot:[`item.icono`]="{ item }">
            <v-layout justify-center>
              <v-icon v-html="item.icono" color="primary"></v-icon>
            </v-layout>
          </template>

          <!-- Boton de estatus -->
          <template v-slot:[`item.activo`]="{ item }">
            <v-layout justify-center>
              <v-switch
                v-model="item.activo"
                color="success"
                @change="cambiarEstatus(item.id, item.activo)"
                inset
              ></v-switch>
            </v-layout>
          </template>

          <!-- Fecha de creación -->
          <template v-slot:[`item.created_at`]="{ item }">
            {{ moment(item.created_at).format('DD/MM/YYYY') }}
          </template>

          <!-- Boton de acciones -->
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn @click="editar(item.id)" color="secondary" icon>
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
          </template>

          <!-- Sin datos en la tabla -->
          <template v-slot:no-data>
            <span>Sin permisos</span>
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
      :titulo="form.id ? 'Modificar Permiso' : 'Nuevo Permiso'"
      :abrir="dialog"
      @cerrar="dialog = false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardar()">
          <v-row class="mt-2" dense>
            <app-autocomplete
              label="Tipo del permiso"
              placeholder="Tipo del permiso"
              :items="[
                { id: 1, texto: 'Menu'},
                { id: 2, texto: 'Submenu'},
                { id: 3, texto: 'Acción'},
              ]"
              valor="id"
              texto="texto"
              :data="form.acl_permiso_tipo_id"
              @value="form.acl_permiso_tipo_id = $event"
              :error-messages="error.acl_permiso_tipo_id"
              nodata="Sin permisos"
              :rounded="true"
              requerido
              cols="12"
              lg="12"
              sm="12"
            />

            <app-autocomplete
              v-if="form.acl_permiso_tipo_id !== 1 && form.acl_permiso_tipo_id"
              label="Submenu de"
              placeholder="Permiso al que pertenece"
              :items="obtPermisosPadre"
              valor="id"
              texto="nombre"
              :data="form.acl_permiso_padre_id"
              @value="form.acl_permiso_padre_id = $event"
              :error-messages="error.acl_permiso_padre_id"
              nodata="Sin permisos"
              :rounded="true"
              requerido
              cols="12"
              lg="12"
              sm="12"
            />

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
              <span class="texto--text">Código</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.codigo"
                placeholder="Código del permiso"
                autocomplete="off"
                :error-messages="error.codigo"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="form.acl_permiso_tipo_id !== 3 && form.acl_permiso_tipo_id">
              <span class="texto--text">Orden</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.orden_permiso"
                placeholder="Número de orden en el menú"
                autocomplete="off"
                :error-messages="error.orden_permiso"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="form.acl_permiso_tipo_id !== 3 && form.acl_permiso_tipo_id">
              <span class="texto--text">Url</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.menu_url"
                placeholder="Url del menú"
                autocomplete="off"
                :error-messages="error.menu_url"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="form.acl_permiso_tipo_id !== 3 && form.acl_permiso_tipo_id">
              <span class="texto--text">Icono</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.icono"
                placeholder="Icono en el menu"
                autocomplete="off"
                :prepend-inner-icon="form.icono"
                :error-messages="error.icono"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-checkbox
              v-model="form.activo"
              label="Activo"
              color="accent"
              :value="true"
              hide-details
            ></v-checkbox>

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
import errorResponse from '@/mixins/response';

const formInit = {
  acl_permiso_padre_id: null,
  acl_permiso_tipo_id: null,
  nombre: null,
  codigo: null,
  orden_permiso: null,
  menu_url: null,
  icono: null,
  activo: null,
};

export default {
  name: 'Permisos',

  components: { AppDialog, AppAutocomplete },

  mixins: [funciones, errorResponse],

  data() {
    return {
      tabla: [
        { text: 'ID', align: 'center', value: 'id' },
        { text: 'Icono', value: 'icono' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Código', value: 'codigo' },
        { text: 'Orden', align: 'center', value: 'orden_permiso' },
        { text: 'Url', align: 'center', value: 'menu_url' },
        { text: 'Activo', align: 'center', value: 'activo' },
        { text: 'Acciones', align: 'center', value: 'acciones' },
      ],
      filtros: {
        nombre: null,
        activo: null,
      },
      permisos: [],
      dialog: false,
      form: this.clonar(formInit),
      error: [],
      cargando: false,
      desactivado: false,
    };
  },

  created() {
    this.inicio();
    this.permisosPadre();
  },

  computed: {
    ...mapGetters(['obtPermisosPadre']),
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR']),
    ...mapActions(['permisosPadre']),

    inicio() {
      this.desactivado = true;
      this.CHANGE_OVERLAY(true);

      this.axios
        .get('/administracion/permisos', { params: this.filtros })
        .then((response) => {
          this.permisos = response.data;
        })
        .catch((error) => {
          console.log(error.response);
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
            this.desactivado = false;
          }, 300);
        });
    },

    cambiarEstatus(idPermiso, estatus) {
      this.CHANGE_OVERLAY(true);

      this.axios
        .post(`/administracion/permisos/${idPermiso}/estatus`, { activo: estatus })
        .then(() => {
          this.inicio();
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

    editar(idPermiso) {
      this.form = this.clonar(formInit);
      this.error = [];

      this.axios
        .get(`administracion/permisos/${idPermiso}`)
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
      this.error = [];

      const isNew = this.form.id === undefined;
      const method = isNew ? 'post' : 'put';
      const edit = `/${this.form.id}`;
      const url = `administracion/permisos${isNew ? '' : edit}`;

      if (this.form.activo === null) {
        this.form.activo = 0;
      }

      this.axios({ method, url, data: this.form })
        .then(() => {
          this.inicio();
          this.dialog = false;
          this.form = this.clonar(formInit);
          this.ACTIVATE_SNACKBAR({
            text: isNew ? 'Permiso creado' : 'Se han guardado los cambios',
            color: 'success',
          });
        })
        .catch((error) => {
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.cargando = false;
            this.permisosPadre();
          }, 500);
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
