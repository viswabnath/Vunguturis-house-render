import * as THREE from "three";

// Free the GPU buffers and textures held by a model that is no longer shown.
export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((c) => {
    const mesh = c as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((v) => {
        if (v instanceof THREE.Texture) v.dispose();
      });
      m.dispose();
    });
  });
}
