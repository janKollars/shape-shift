<script setup lang="ts">
import { computed, ref } from 'vue';
import MultiShape from '../components/MultiShape.vue';

const MAX_SHAPES = 10;
const POLYGON_COUNT = 11;

const shapes = ref(1);
const variation = ref(false);

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
const variationFactors = computed(() =>
  Array.from({length: MAX_SHAPES}, () => variation.value ? getRandomNumber(-1, 1) : 1)
)

const MAX_CORNERS = 7;
const ZOOM_SLOPE = 0.5 / POLYGON_COUNT;
const corners = ref(6);
const directionalShiftX = ref(0);
const directionalShiftY = ref(0);
const rotationDegree = ref(0);
const zoom = ref(0)
</script>

<template>
  <div class="grid-mode">
    <div class="grid-mode-settings">
      <label>
        <input
          v-model="variation"
          type="checkbox"
        >
        Variation
      </label>
      <label for="shapes">Shapes</label>
      <input
        id="shapes"
        v-model.number="shapes"
        type="range"
        min="1"
        :max="MAX_SHAPES"
      >
      <label for="corners">Corners</label>
      <input
        id="corners"
        v-model.number="corners"
        type="range"
        min="3"
        :max="MAX_CORNERS"
      >
      <label for="rotation">Rotation</label>
      <input
        id="rotation"
        v-model.number="rotationDegree"
        type="range"
        min="-10"
        max="10"
      >
      <label for="x-shift">X-Shift</label>
      <input
        id="x-shift"
        v-model.number="directionalShiftX"
        type="range"
        min="-5"
        max="5"
        step="0.1"
      >
      <label for="y-shift">Y-Shift</label>
      <input
        id="y-shift"
        v-model.number="directionalShiftY"
        type="range"
        min="-5"
        max="5"
        step="0.1"
      >
      <label for="zoom">Zoom</label>
      <input
        id="zoom"
        v-model.number="zoom"
        type="range"
        :min="-ZOOM_SLOPE"
        :max="ZOOM_SLOPE"
        step="0.001"
      >
    </div>
    <div class="drawing-grid">
      <MultiShape
        v-for="i in shapes"
        :key="i"
        :corners="corners"
        :directional-shift-x="directionalShiftX * variationFactors[i - 1]"
        :directional-shift-y="directionalShiftY * variationFactors[i - 1]"
        :rotation-degree="rotationDegree * variationFactors[i - 1]"
        :zoom="zoom * variationFactors[i - 1]"
      />
    </div>
  </div>
</template>

<style>
.grid-mode {
  display: grid;
  width: 100%;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 2rem;
}
.grid-mode-settings {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  align-self: start;
}
.drawing-grid {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
}
.drawing-grid > * {
  max-height: 80vh;
}
</style>
