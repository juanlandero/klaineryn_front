<template>
  <v-row>
    <v-col cols="12">
      <v-stepper elevation="0" class="transparent" alt-labels >
        <v-stepper-header>
          <v-stepper-step
            step="1"
            :complete="false"
          >
            Tipo de plan
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            step="2"
            :complete="false"
          >
            Precios
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">
            Pago
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
    </v-col>

    <v-col cols="9">
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card
            class="mb-12"
            color="grey lighten-1"
            height="200px"
          ></v-card>

          <v-btn
            color="primary"
            @click="e1 = 2"
          >
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card
            class="mb-12"
            color="grey lighten-1"
            height="200px"
          ></v-card>

          <v-btn
            color="primary"
            @click="e1 = 3"
          >
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
            class="mb-12"
            color="grey lighten-1"
            height="200px"
          ></v-card>

          <v-btn
            color="primary"
            @click="e1 = 1"
          >
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
      <v-card class="pa-6 rounded-lg">
        l
      </v-card>
    </v-col>

    <v-col cols="3">
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
</template>

<script>
export default {
  name: 'PlanesPrecios',
};
</script>
