<template>
  <v-stepper v-model="e1" elevation="0" class="transparent" alt-labels >
    <v-row>
      <v-col cols="12">
        <v-stepper-header>

          <v-stepper-step :step="1" :complete="false" editable>Tipo de plan</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :step="2" :complete="false" editable>Precios</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :step="3" editable>Pago</v-stepper-step>

        </v-stepper-header>
      </v-col>

      <v-col cols="9">
        <v-stepper-items>
          <v-stepper-content :step="1" >
            <v-card class="pa-6 rounded-lg">
              step1
            </v-card>
          </v-stepper-content>

          <v-stepper-content :step="2">
            <v-card class="pa-6 rounded-lg">
              step2
            </v-card>
          </v-stepper-content>

          <v-stepper-content :step="3">
            <v-card class="pa-6 rounded-lg">
              step3
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-col>

      <v-col cols="3" class="pt-9">
        <v-card class="pa-6 rounded-lg">
          <v-row>
            <v-col cols="6">
              <h5>TOTAL</h5>
            </v-col>
            <v-col cols="6">
              <h5>$ 203.00</h5>
            </v-col>
            <v-divider></v-divider>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-stepper>
</template>

<script>
export default {
  name: 'PlanesPrecios',

  data() {
    return {
      e1: 1,
    };
  },
};
</script>
