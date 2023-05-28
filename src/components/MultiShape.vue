<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  corners: number,
  directionalShiftX: number,
  directionalShiftY: number,
  rotationDegree: number,
  zoom: number
}>();

const POLYGON_COUNT = 11;

function generateShapePoints(corners: number, distance: number): string {
  const cx = 50; // x-coordinate of center
  const cy = 50; // y-coordinate of center
  const r = 50 - distance; // radius of hexagon
  const points = Array.from({ length: corners }, (_, i) => {
    const theta = (i * Math.PI) / (corners / 2);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    return `${x} ${y}`;
  });
  return points.join(' ');
}

const polygons = computed(() =>
  Array.from({ length: POLYGON_COUNT }, (_, i) =>
    generateShapePoints(props.corners, (i + 1) * 4)
  )
);
</script>

<template>
  <svg
    class="multi-shape"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      '--rotation': rotationDegree,
      '--shift-x': directionalShiftX,
      '--shift-y': directionalShiftY,
      '--zoom': zoom,
      '--polygons': POLYGON_COUNT
    }"
  >
    <polygon
      v-for="(polygon, i) in polygons"
      :key="i"
      class="multi-shape__polygon"
      :style="{
        '--index': i
      }"
      :points="polygon"
      stroke="#fff"
      :fill="i === polygons.length - 1 ? '#fff' : '#444'"
    />
  </svg>
</template>

<style scoped>
.multi-shape__polygon {
  transform:
    rotate(calc(1deg * var(--rotation) * (1 / var(--polygons) * var(--index))))
    translate(calc(1px * var(--shift-x) * var(--index)), calc(1px * var(--shift-y) * var(--index))) scale(calc(1 + var(--zoom) * var(--index)));
  transform-origin: center;
}
</style>
