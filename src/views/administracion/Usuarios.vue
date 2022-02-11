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
          <!-- Botón de estatus -->
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

          <!-- Botones de acciones -->
          <template v-slot:[`item.acciones`]="{ item }">
            <v-row>
              <v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="abrirModalSaldo(item.id)"
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      icon
                    >
                      <v-icon>mdi-currency-usd</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar saldo</span>
                </v-tooltip>
              </v-col>
              <v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="editar(item.id)"
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      icon
                    >
                      <v-icon>mdi-square-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </v-col>
            </v-row>
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

    <!-- Modal Agregar/Editar -->
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
                :error-messages="errors.nombre"
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
              :error-messages="errors.rol_id"
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
                :error-messages="errors.email"
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
                :error-messages="errors.password"
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
    <!-- Modal Agregar Saldo -->
    <app-dialog
      titulo="Agregar Saldo"
      :abrir="dialogSaldo"
      @cerrar="dialogSaldo = false"
    >
      <template v-slot:contenido>
        <form @submit.prevent="guardarSaldo">
          <v-row class="mt-2" dense>
            <app-autocomplete
              label="Plan"
              placeholder="Elige un tipo de plan"
              :items="tipos_saldos"
              valor="id"
              texto="nombre"
              :data="formSaldo.descripciones_tipo_id"
              @value="formSaldo.descripciones_tipo_id = $event"
              :error-messages="errors.descripciones_tipo_id"
              nodata="Sin tipos de recarga"
              requerido
              :rounded="true"
            />

            <v-col cols="6">
              <span class="texto--text">Saldo</span>
              <span class="error--text"> *</span>
              <v-text-field
                v-model="formSaldo.cantidad"
                placeholder="Cantidad"
                autocomplete="off"
                :error-messages="errors.cantidad"
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
  </v-row>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import AppDialog from '@/components/AppDialog.vue';
import AppAutocomplete from '@/components/AppAutocomplete.vue';
import funciones from '@/mixins/funciones';
import errorResponse from '@/mixins/response';

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

  mixins: [funciones, errorResponse],

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
      dialogSaldo: false,
      form: this.clonar(formInit),
      formSaldo: {
        user_id: null,
        descripciones_tipo_id: null,
        cantidad: null,
      },
      errors: [],
      show: false,
      show2: false,
      cargando: false,
      desactivado: false,
      tipos_saldos: null,
    };
  },

  created() {
    this.inicio();
    this.roles();
    this.obtTiposSaldos();
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
          this.errorsResponse(error.response);
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
          this.errorsResponse(error.response);
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
          this.errorsResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.cargando = false;
          }, 500);
        });
    },

    abrirModalSaldo(idUsuario) {
      this.dialogSaldo = true;
      this.formSaldo.user_id = idUsuario;
      this.formSaldo.descripciones_tipo_id = null;
      this.formSaldo.cantidad = null;
      this.errors = [];
    },

    guardarSaldo() {
      this.CHANGE_OVERLAY(true);

      this.axios
        .post('/saldos/add_saldo', this.formSaldo)
        .then(() => {
          this.inicio();
          this.dialogSaldo = false;
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

    obtTiposSaldos() {
      this.axios
        .get('/planes/descripciones_tipos')
        .then((response) => {
          this.tipos_saldos = response.data.data;
        })
        .catch((error) => {
          console.log(error.response);
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
