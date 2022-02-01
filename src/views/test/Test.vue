<template>
  <div>
    <v-card class="mb-4">
      <v-card-text>
        <v-select
          v-model="steps"
          :items="[2, 3, 4, 5, 6]"
          label="# of steps"
        ></v-select>
      </v-card-text>
    </v-card>

    <v-stepper v-model="e1" elevation="0" class="transparent" alt-labels>
      <v-stepper-header>
        <v-stepper-step
          :complete="0"
          :step="1"
          editable
        >
          Step 1
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          :complete="0"
          :step="2"
          editable
        >
          Step 2
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          :complete="0"
          :step="3"
          editable
        >
          Step 3
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <v-btn color="primary" @click="nextStep(n)"> Continue </v-btn>

          <v-btn text> Cancel </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
export default {
  data() {
    return {
      e1: 1,
      steps: 2,
    };
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
  },

  methods: {
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
  },
};
</script>
