# Source 3D models

Uncompressed Blender exports of the construction stages. The site serves the
meshopt-compressed copies in `public/models/stages/`. After re-exporting a stage, regenerate its compressed copy:

```bash
npx @gltf-transform/cli@4.2.1 meshopt models-src/stages/10_complete.glb public/models/stages/10_complete.glb
```
