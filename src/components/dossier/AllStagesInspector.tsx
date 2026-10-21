"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ALL_STAGES_DATA, StageDetail } from "@/data/projectData";
import { disposeObject } from "@/lib/three-utils";
import { useFullscreen } from "@/lib/useFullscreen";

type CameraPreset = "front" | "isometric" | "top";

// Scale the model to a 9-unit envelope, centre it and sit it on the ground. Run once per model.
function normalizeModel(obj: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 9 / (Math.max(size.x, size.y, size.z) || 1);
  obj.scale.setScalar(scale);
  obj.position.sub(center.multiplyScalar(scale));
  obj.position.y -= new THREE.Box3().setFromObject(obj).min.y;
}

function applyWireframe(obj: THREE.Object3D, on: boolean) {
  obj.traverse((c) => {
    const mesh = c as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      if ("wireframe" in m) (m as THREE.MeshStandardMaterial).wireframe = on;
    });
  });
}

export default function AllStagesInspector() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(wrapRef);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [cameraAngle, setCameraAngle] = useState<CameraPreset>("front");
  const [interacted, setInteracted] = useState<boolean>(false);
  const [sceneReady, setSceneReady] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelRef = useRef<THREE.Object3D | null>(null);
  const wireframeRef = useRef(wireframe);
  const cameraAngleRef = useRef(cameraAngle);
  wireframeRef.current = wireframe;
  cameraAngleRef.current = cameraAngle;

  const stage: StageDetail =
    ALL_STAGES_DATA.find((s) => s.id === activeStageId) || ALL_STAGES_DATA[0];

  // Point the camera at an already-normalized model from the chosen preset.
  const positionCamera = useCallback((obj: THREE.Object3D, camPreset: CameraPreset) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    const box = new THREE.Box3().setFromObject(obj);
    const c = box.getCenter(new THREE.Vector3());
    const s = box.getSize(new THREE.Vector3());
    controls.target.copy(c);

    // Pull back further on tall, narrow frames (phones, portrait full screen) so the sides stay in view
    const d = Math.max(s.x, s.y, s.z) * 1.5 * Math.max(1, 0.85 / camera.aspect);

    if (camPreset === "front") {
      camera.position.set(c.x, c.y + d * 0.35, c.z + d * 1.15);
    } else if (camPreset === "isometric") {
      camera.position.set(c.x + d * 0.75, c.y + d * 0.65, c.z + d * 0.75);
    } else {
      camera.position.set(c.x, c.y + d * 1.5, c.z + 0.01);
    }
    controls.update();
  }, []);

  // Initialize Scene (once)
  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;

    let destroyed = false;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    // Phones: fewer pixels and smaller shadows roughly halve the GPU work with little visible difference
    const touch = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1114);
    scene.fog = new THREE.FogExp2(0x0f1114, 0.014);
    sceneRef.current = scene;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;

    // Architectural Lighting
    scene.add(new THREE.AmbientLight(0xfff8f0, 0.8));
    const key = new THREE.DirectionalLight(0xfff5e0, 2.8);
    key.position.set(14, 22, 16);
    key.castShadow = true;
    key.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048);
    key.shadow.bias = -0.0003;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x8899cc, 0.55);
    fill.position.set(-16, 8, -12);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xf5c065, 0.3);
    rim.position.set(0, -4, -20);
    scene.add(rim);

    // Ground plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshStandardMaterial({ color: 0x0f1114, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 500);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 80;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.45;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;
    controlsRef.current = controls;

    function resize() {
      if (!wrap || destroyed) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      const shapeChanged = Math.abs(camera.aspect - w / h) > 0.05;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Re-frame when the viewer changes shape, e.g. entering or leaving full screen
      if (shapeChanged && currentModelRef.current) positionCamera(currentModelRef.current, cameraAngleRef.current);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    const handlePointerDown = () => {
      controls.autoRotate = false;
      setInteracted(true);
    };
    canvas.addEventListener("pointerdown", handlePointerDown);

    // Only render while the viewer is on screen
    let animId = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!animId) animate();
      } else {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    });
    visibilityObserver.observe(wrap);

    setSceneReady(true);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      controls.dispose();
      if (currentModelRef.current) {
        disposeObject(currentModelRef.current);
        currentModelRef.current = null;
      }
      ground.geometry.dispose();
      ground.material.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      setSceneReady(false);
    };
  }, [positionCamera]); // stable (no deps), listed because resize() calls it

  // Load Model for Selected Stage
  useEffect(() => {
    if (!sceneReady) return;

    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    setProgress(0);

    const st = ALL_STAGES_DATA.find((s) => s.id === activeStageId) || ALL_STAGES_DATA[0];
    const modelPath = `/models/stages/${st.filename}`;

    // Stage models are meshopt-compressed (see models-src/README.md)
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        const scene = sceneRef.current;
        // A newer stage was selected (or we unmounted) while this one was downloading
        if (cancelled || !scene) {
          disposeObject(model);
          return;
        }

        if (currentModelRef.current) {
          scene.remove(currentModelRef.current);
          disposeObject(currentModelRef.current);
        }

        model.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        applyWireframe(model, wireframeRef.current);
        normalizeModel(model);
        positionCamera(model, cameraAngleRef.current);
        scene.add(model);
        currentModelRef.current = model;
        setLoading(false);
      },
      (xhr) => {
        if (cancelled) return;
        if (xhr.total > 0) {
          setProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          setProgress((prev) => (prev < 90 ? prev + 15 : prev));
        }
      },
      (err) => {
        if (cancelled) return;
        console.error("Failed to load stage model:", modelPath, err);
        // Don't leave the previous stage's model on screen under this stage's title
        if (currentModelRef.current && sceneRef.current) {
          sceneRef.current.remove(currentModelRef.current);
          disposeObject(currentModelRef.current);
          currentModelRef.current = null;
        }
        setLoadError(true);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [activeStageId, reloadKey, sceneReady, positionCamera]);

  // Keep the selected stage tab visible in the horizontally scrolling stepper (without moving the page)
  useEffect(() => {
    const strip = stepperRef.current;
    const btn = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!strip || !btn) return;
    const left = btn.offsetLeft; // .stepper is position: relative, so this is relative to the strip
    if (left < strip.scrollLeft || left + btn.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: left - 16, behavior: "smooth" });
    }
  }, [activeStageId]);

  // Toggle wireframe on the loaded model without reloading it
  useEffect(() => {
    if (currentModelRef.current) applyWireframe(currentModelRef.current, wireframe);
  }, [wireframe]);

  // Handle camera angle switch
  const switchCameraAngle = (preset: CameraPreset) => {
    setCameraAngle(preset);
    if (currentModelRef.current) {
      positionCamera(currentModelRef.current, preset);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
    { id: "front", label: "Front" },
    { id: "isometric", label: "3D" },
    { id: "top", label: "Top" },
  ];

  return (
    // Rendered inside LazyStages, which owns the #stages-inspector section
    <>
      <div className="wrap">
        <div className="section-head">
          <h2>The build, stage by stage</h2>
          <p>Eleven 3D models, from the empty plot to the finished house. Pick a stage to see its model and measurements.</p>
        </div>

        <div ref={stepperRef} className="stepper" role="group" aria-label="Construction stage">
          {ALL_STAGES_DATA.map((st) => (
            <button key={st.id} onClick={() => setActiveStageId(st.id)} aria-pressed={st.id === activeStageId}>
              <span className="num">{pad(st.id)}</span>
              {st.title}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 0 }}>
        <div className="inspector-grid">
          <div ref={wrapRef} className="viewer-pane">
            <canvas ref={canvasRef} />

            <div className="viewer-controls">
              <div className="seg" role="group" aria-label="Camera view">
                {CAMERA_PRESETS.map((c) => (
                  <button key={c.id} aria-pressed={cameraAngle === c.id} onClick={() => switchCameraAngle(c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="seg">
                <button aria-pressed={wireframe} onClick={() => setWireframe(!wireframe)}>Wireframe</button>
              </div>
              <div className="seg viewer-fs">
                <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit full screen" : "View the 3D model full screen"}>
                  {isFullscreen ? "Exit full screen" : "Full screen"}
                </button>
              </div>
            </div>

            {isFullscreen && (
              <div className="viewer-fs-bar">
                <button
                  className="seg-btn"
                  onClick={() => setActiveStageId((id) => Math.max(1, id - 1))}
                  disabled={activeStageId === 1}
                >
                  Previous
                </button>
                <div className="viewer-fs-title">
                  <span className="num">{pad(stage.id)}</span> {stage.title}
                </div>
                <button
                  className="seg-btn"
                  onClick={() => setActiveStageId((id) => Math.min(ALL_STAGES_DATA.length, id + 1))}
                  disabled={activeStageId === ALL_STAGES_DATA.length}
                >
                  Next
                </button>
              </div>
            )}

            <div className={`viewer-status ${loading ? "" : "done"}`} aria-live="polite">
              <div>Loading stage {pad(stage.id)}</div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {loadError && (
              <div className="viewer-status" role="alert">
                <div>Stage {pad(stage.id)} could not be loaded.</div>
                <button className="btn btn-ghost" style={{ color: "#e9ebee", borderColor: "#e9ebee" }} onClick={() => setReloadKey((k) => k + 1)}>
                  Try again
                </button>
              </div>
            )}

            <div className={`viewer-hint ${interacted ? "hide" : ""}`}>Drag to turn, scroll or pinch to zoom</div>
          </div>

          <div className="inspector-panel">
            <div className="panel-meta">
              <span className="num">{pad(stage.id)}</span> of {ALL_STAGES_DATA.length}, {stage.category.toLowerCase()}
            </div>
            <h3>{stage.title}</h3>
            <p className="tagline">{stage.tagline}</p>

            <dl className="spec-list">
              <div>
                <dt>Size</dt>
                <dd>
                  {stage.dimensions.metric}
                  <span style={{ display: "block", color: "var(--ink-3)", fontSize: "0.85rem" }}>{stage.dimensions.imperial}</span>
                </dd>
              </div>
              <div>
                <dt>{stage.area.label}</dt>
                <dd>
                  <span className="num">{stage.area.sqFt.toLocaleString("en-IN", { minimumFractionDigits: 1 })} sq.ft</span>
                  <span style={{ display: "block", color: "var(--ink-3)", fontSize: "0.85rem" }}>{stage.area.sqM} m²</span>
                </dd>
              </div>
              {stage.clearHeight && (
                <div>
                  <dt>Floor height</dt>
                  <dd>{stage.clearHeight}</dd>
                </div>
              )}
              {stage.keySpecs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className="panel-notes">{stage.architecturalNotes}</p>
            <p className="panel-parts">In this model: {stage.componentsList.join(", ")}.</p>
          </div>
        </div>
      </div>
    </>
  );
}
