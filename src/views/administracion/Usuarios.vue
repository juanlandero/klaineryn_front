<template>
  <v-row>
    <!-- Titulo -->
    <v-col cols="12">
      <h3 class="texto--text">Usuarios</h3>
    </v-col>

    <!-- Filtros -->
    <v-col cols="12" class="mb-6 mt-2">
      <form @submit.prevent="inicio()">
        <v-row dense>
          <v-col cols="12" sm="3">
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
          <v-col cols="12" sm="3">
            <v-text-field
              label="Email"
              v-model="filtros.email"
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
            :data="filtros.is_active"
            @value="filtros.is_active = $event"
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
          :items="usuarios"
          class="texto--text"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-all-text': 'Todos',
            pageText: '{0}-{1} de {2}',
          }"
        >
          <!-- Boton de estatus -->
          <template v-slot:[`item.is_active`]="{ item }">
            <v-layout justify-center>
              <v-switch
                v-model="item.is_active"
                color="success"
                @change="cambiarEstatus(item.id, item.is_active)"
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
            <span>Sin usuarios</span>
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
      :titulo="form.id ? 'Modificar Usuarios' : 'Nuevo Usuario'"
      :abrir="dialog"
      @cerrar="dialog = false"
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

            <app-autocomplete
              label="Rol"
              placeholder="Rol del usuario"
              :items="obtRoles"
              valor="id"
              texto="nombre"
              :data="form.rol_id"
              @value="form.rol_id = $event"
              :error-messages="error.rol_id"
              nodata="Sin roles"
              requerido
              :rounded="true"
              cols="12"
              lg="12"
              sm="12"
            />

            <v-col cols="12">
              <span class="texto--text">Correo electrónico</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.email"
                placeholder="e-mail"
                autocomplete="off"
                :error-messages="error.email"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <span class="texto--text">Contraseña</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="form.password"
                placeholder="Correo electrónico"
                :append-icon="show ? 'mdi-eye':'mdi-eye-off'"
                :type="show ? 'text':'password'"
                @click:append="show = !show"
                autocomplete="off"
                :error-messages="error.password"
                outlined
                rounded
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <span class="texto--text">Confirmar contraseña</span>
              <v-text-field
                v-model="form.confirmarPassword"
                placeholder="Correo electrónico"
                :append-icon="show2 ? 'mdi-eye':'mdi-eye-off'"
                :type="show ? 'text':'password'"
                @click:append="show2 = !show2"
                autocomplete="off"
                :error-messages="errorPassword"
                outlined
                rounded
                dense
              ></v-text-field>

              <v-checkbox
                v-model="form.is_active"
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
  email: null,
  password: null,
  confirmarPassword: null,
  rol_id: null,
  is_active: null,
};

export default {
  name: 'Usuarios',

  components: { AppDialog, AppAutocomplete },

  mixins: [funciones],

  data() {
    return {
      tabla: [
        { text: 'ID', align: 'center', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Email', value: 'email' },
        { text: 'Rol', align: 'center', value: 'rol.nombre' },
        { text: 'Creado', align: 'center', value: 'created_at' },
        { text: 'Activo', align: 'center', value: 'is_active' },
        { text: 'Acciones', align: 'center', value: 'acciones' },
      ],
      filtros: {
        nombre: null,
        email: null,
        is_active: null,
      },
      usuarios: [],
      dialog: false,
      form: this.clonar(formInit),
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
  },

  computed: {
    ...mapGetters(['obtRoles']),

    errorPassword() {
      if (this.form.confirmarPassword != null) {
        if (this.form.password !== this.form.confirmarPassword) {
          return 'Las contraseñas no coinciden';
        }
      }
      return null;
    },
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR']),
    ...mapActions(['roles']),

    inicio() {
      this.desactivado = true;
      this.CHANGE_OVERLAY(true);

      this.axios
        .get('/administracion/usuarios', { params: this.filtros })
        .then((response) => {
          this.usuarios = response.data;
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

    cambiarEstatus(idUsuario, estatus) {
      this.CHANGE_OVERLAY(true);

      this.axios
        .post(`/administracion/usuarios/${idUsuario}/estatus`, { is_active: estatus })
        .then(() => {
          this.inicio();
        })
        .catch((error) => {
          switch (error.response.status) {
            case 400:
              this.ACTIVATE_SNACKBAR({
                text: error.response.data.message,
                color: 'error',
              });
              break;

            default:
              this.ACTIVATE_SNACKBAR({
                text: 'Error al cambiar estatus',
                color: 'error',
              });
              break;
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
          }, 300);
        });
    },

    editar(idUsuario) {
      this.form = this.clonar(formInit);
      this.errors = [];

      this.axios
        .get(`administracion/usuarios/${idUsuario}`)
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
      this.errors = [];

      const isNew = this.form.id === undefined;
      const method = isNew ? 'post' : 'put';
      const edit = `/${this.form.id}`;
      const url = `administracion/usuarios${isNew ? '' : edit}`;

      if (this.form.is_active === null) {
        this.form.is_active = 0;
      }

      this.axios({ method, url, data: this.form })
        .then(() => {
          this.inicio();
          this.dialog = false;
          this.form = this.clonar(formInit);
          this.ACTIVATE_SNACKBAR({
            text: isNew ? 'Usuario creado' : 'Se han guardado los cambios',
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
