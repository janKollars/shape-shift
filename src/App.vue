<script setup lang="ts">
import { useHasSensors } from './composables/sensors';
import GridMode from './components/GridMode.vue';
import { ref } from 'vue';
import ImmersionMode from './components/ImmersionMode.vue';

const hasSensors = useHasSensors();
const loading = ref(true);
const immersion = ref(false);
setTimeout(() => {
  loading.value = false
}, 700);
</script>

<template>
  <template v-if="!loading">
    <template v-if="hasSensors">
      <button
        v-if="!immersion"
        class="start-btn"
        @click="immersion = true"
      >
        Immersion
      </button>
      <ImmersionMode v-else />
    </template>
    <GridMode v-else />
  </template>
</template>

<style>
.start-btn {
  display: block;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
}
</style>
