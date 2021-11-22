<template>
  <v-list rounded dense nav>
    <div
      v-for="seccion in datos"
      :key="seccion.nombre"
    >
      <v-list-item
        v-if="seccion.menu_url"
        :key="seccion.id"
        v-model="seccion.active"
        :color="color"
        class="my-1"
        like
        :to="seccion.menu_url">
        <v-list-item-icon>
          <v-icon>{{ seccion.icono }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ seccion.nombre }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        v-else
        :prepend-icon="seccion.icono"
        :color="color"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ seccion.nombre }}</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="permiso in seccion.permisos"
          :key="permiso.id"
          link
          :to="permiso.menu_url"
          class="pl-10"
        >
          <v-list-item-icon>
            <v-icon v-text="permiso.icono"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ permiso.nombre }}</v-list-item-title>
        </v-list-item>
      </v-list-group>

    </div>
  </v-list>
</template>

<script>
export default {
  name: 'AppSingleListItem',

  props: {
    datos: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String,
      default: 'primary',
    },
  },

  data() {
    return {
      activo: null,
    };
  },

};
</script>
