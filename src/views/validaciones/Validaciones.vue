<template>
  <v-row>
    <!-- Titulo -->
    <v-col cols="12">
      <h3 class="texto--text">Historial de validaciones</h3>
    </v-col>

    <!-- Gráfico -->
    <v-col cols="12" class="mb-5" style="z-index: 1">
      <v-card class="py-6 px-16 rounded-lg">
        <apexchart
          v-if="mostrarChart"
          height="400px"
          type="line"
          :options="options"
          :series="series"
        ></apexchart>
      </v-card>
    </v-col>

    <!-- Tabla -->
    <v-col cols="12" class="mb-6">
      <v-card class="pa-6 rounded-lg">
        <!-- Filtros -->
        <v-col cols="12" class="mb-6 mt-2">
          <form @submit.prevent="inicio()">
            <v-row dense>

              <app-date-picker
                placeholder="yyyy-mm-dd"
                label="Desde"
                clearable
                rounded
                :cols="3"
                :lg="4"
                :sm="4"
                :data="filtros.fecha_desde"
                @value="cambiarFecha(true, $event)"
              />

              <app-date-picker
                placeholder="yyyy-mm-dd"
                label="Hasta"
                clearable
                rounded
                :cols="3"
                :lg="4"
                :sm="4"
                :data="filtros.fecha_hasta"
                @value="cambiarFecha(false, $event)"
              />

              <v-col align="right" align-self="center">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      rounded
                    >
                      <v-icon left>mdi-filter-outline</v-icon>
                      Más
                    </v-btn>
                  </template>

                  <v-card class="px-3">
                    <v-subheader>Más filtros</v-subheader>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="RFC del emisor"
                        v-model="filtros.rfc_emisor"
                        hide-details
                        clearable
                        outlined
                        rounded
                        dense
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="RFC del receptor"
                        v-model="filtros.rfc_receptor"
                        hide-details
                        clearable
                        outlined
                        rounded
                        dense
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Uuid"
                        v-model="filtros.uuid"
                        hide-details
                        clearable
                        outlined
                        rounded
                        dense
                      ></v-text-field>
                    </v-col>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        type="submit"
                        color="primary"
                        @click="filtrar"
                        rounded
                      >
                        Aplicar
                      </v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-col>

            </v-row>
          </form>
        </v-col>

        <v-data-table
          :headers="tabla"
          :items="validaciones"
          class="texto--text"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-all-text': 'Todos',
            pageText: '{0}-{1} de {2}',
          }"
        >
          <!-- Fecha de creación -->
          <template v-slot:[`item.success`]="{ item }">
            {{ moment(item.success).format('DD/MM/YYYY') }}
          </template>

          <!-- Fecha de creación -->
          <template v-slot:[`item.created_at`]="{ item }">
            {{ moment(item.created_at).format('DD/MM/YYYY') }}
          </template>

          <!-- Sin datos en la tabla -->
          <template v-slot:no-data>
            <span>Sin validaciones</span>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex';
import AppDatePicker from '@/components/AppDatePicker.vue';
import errorResponse from '@/mixins/response';

export default {
  name: 'Validaciones',

  components: { AppDatePicker },

  mixins: { errorResponse },

  data() {
    return {
      tabla: [
        { text: 'RFC Emisor', value: 'rfc_emisor' },
        { text: 'RFC Receptor', value: 'rfc_receptor' },
        { text: 'Uuid', align: 'center', value: 'uuid' },
        { text: 'Total', align: 'center', value: 'total' },
        { text: 'Creado', align: 'center', value: 'created_at' },
      ],
      filtros: {
        fecha_desde: this.moment().subtract(7, 'days').format('YYYY-MM-DD'),
        fecha_hasta: this.moment(new Date()).format('YYYY-MM-DD'),
        rfc_emisor: null,
        rfc_receptor: null,
        uuid: null,
      },
      validaciones: [],
      menu: false,
      options: {
        chart: {
          id: 'vuechart-example',
        },
        title: {
          text: 'Validaciones realizadas',
          align: 'left',
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#FF5252', '#00C853'],
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
        },
        noData: {
          text: 'Cargando datos...',
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          size: 5,
        },
        tooltip: {
          x: {
            show: false,
          },
          theme: 'dark',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optiona
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 100],
            colorStops: [],
          },
        },
      },
      series: [],
      mostrarChart: true,
    };
  },

  created() {
    this.inicio();
    this.dataChart();
  },

  methods: {
    ...mapMutations(['CHANGE_OVERLAY', 'ACTIVATE_SNACKBAR']),

    inicio() {
      this.desactivado = true;
      this.CHANGE_OVERLAY(true);

      this.axios
        .get('/cfdi/validaciones', { params: this.filtros })
        .then((response) => {
          this.validaciones = response.data.data;
        })
        .catch((error) => {
          this.errorResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
            this.desactivado = false;
          }, 300);
        });
    },

    dataChart() {
      this.axios
        .get('/cfdi/validaciones/grafica')
        .then((response) => {
          this.mostrarChart = false;

          this.options.xaxis.categories = response.data.categories;
          this.series = response.data.series.reverse();
          // console.log(response.data.categories);

          setTimeout(() => {
            this.mostrarChart = true;
          }, 300);
        })
        .catch((error) => {
          this.errorResponse(error.response);
        })
        .finally(() => {
          setTimeout(() => {
            this.CHANGE_OVERLAY(false);
            this.desactivado = false;
          }, 300);
        });
    },

    cambiarFecha(tipo, fecha) {
      if (tipo) {
        this.filtros.fecha_desde = fecha;
      } else {
        this.filtros.fecha_hasta = fecha;
      }
      this.inicio();
    },

    filtrar() {
      this.menu = false;
      this.inicio();
    },
  },
};
</script>
