<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import MultiShape from '../components/MultiShape.vue';
import { useSensors } from '../composables/sensors';

const requestRotationLock = () => {
  document.documentElement.requestFullscreen();
  screen.orientation.lock('portrait');
}
const clickHandler = () => {
  if (!document.fullscreenElement) {
    requestRotationLock();
  }
};
document.documentElement.addEventListener('click', clickHandler);
onBeforeUnmount(() => {
  document.documentElement.removeEventListener('click', clickHandler)
});

const sensors = useSensors();
</script>

<template>
  <MultiShape
    :corners="6"
    :directional-shift-x="sensors.directionalShiftX.value"
    :directional-shift-y="sensors.directionalShiftY.value"
    :rotation-degree="sensors.rotation.value"
    :zoom="sensors.zoom.value"
  />
</template>
