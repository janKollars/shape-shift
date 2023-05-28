import { Ref, onBeforeUnmount, ref } from 'vue';

export const useHasSensors = () => {
  const hasSensors = ref(false);
  if ('RelativeOrientationSensor' in window) {
    Promise.all([
      navigator.permissions.query({ name: 'accelerometer' as PermissionName }),
      navigator.permissions.query({ name: 'gyroscope'  as PermissionName })
    ])
      .then(results => {
        if (results.some(permissionStatus => permissionStatus.state !== 'granted')) {
          return;
        }
        try {
          const sensor = new RelativeOrientationSensor();
          sensor.start();
          sensor.onreading = () => {
            if (sensor.quaternion) {
              hasSensors.value = true
            }
            sensor.stop();
          };
        } catch (e) { /* empty */ }
      })
      .catch(() => {});
  }
  return hasSensors;
}

export function useSensors() {
  const directionalShiftX = ref(0);
  const directionalShiftY = ref(0);
  const rotation = ref(0);
  initRelativeOrientationSensor(directionalShiftX, directionalShiftY, rotation);

  const zoom = ref(0);
  initLinearAccelerationSensor(zoom);

  return {
    directionalShiftX,
    directionalShiftY,
    rotation,
    zoom
  };
}

const initRelativeOrientationSensor = (
  directionalShiftX: Ref<number>,
  directionalShiftY: Ref<number>,
  rotation: Ref<number>
) => {
  let rotationOffset: number;
  const sensor = new RelativeOrientationSensor({ frequency: 30 });
  sensor.onreading = () => {
    if (sensor.quaternion) {
      directionalShiftX.value = sensor.quaternion[1] * -4;
      directionalShiftY.value = sensor.quaternion[0] * -4;
      if (rotationOffset === undefined) {
        rotationOffset = sensor.quaternion[2]
      }
      rotation.value = (sensor.quaternion[2] - rotationOffset) * 180;
    }
  };
  sensor.onerror = (e) => {
    console.log(e)
  }
  sensor.start();
  onBeforeUnmount(() => {
    sensor.stop();
  })
}

const initLinearAccelerationSensor = (zoom: Ref<number>) => {
  const laSensor = new LinearAccelerationSensor({ frequency: 30 });
  laSensor.onreading = () => {
    if (laSensor.z !== undefined) {
      zoom.value += laSensor.z / 1000
    }
  };
  laSensor.start();
  onBeforeUnmount(() => {
    laSensor.stop()
  })
}
