"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { disposeObject } from "@/lib/three-utils";

const MODEL_URL = "/models/stages/10_complete.glb";

// Site context that makes the house tiny in a small frame; the stages viewer still shows it.
const HIDDEN_COLLECTIONS = ["01_Terrain_and_Neighbours", "05_Road", "06_Dimensions_and_Labels", "21_Underground_Services"];

type Props = {
  isFullscreen: boolean;
  onReady: () => void;
  onError: () => void;
};

// The live three.js scene for the hero. Loaded on demand by HeroModel, which shows a still render until then.
export default function HeroScene({ isFullscreen, onReady, onError }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  // Keep the latest callbacks without restarting the scene when the parent re-renders
  const callbacks = useRef({ onReady, onError });
  callbacks.current = { onReady, onError };

  // Zoom and free touch rotation only in full screen; on the page, wheel and swipes keep scrolling
  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) controls.enableZoom = isFullscreen;
    if (canvasRef.current) canvasRef.current.style.touchAction = isFullscreen ? "none" : "pan-y";
  }, [isFullscreen]);

  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      callbacks.current.onError();
      return;
    }
    const touch = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0); // transparent, so the page background shows in both themes
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // There is no ground in the hero, so cut away the footings and anything else below ground level
    renderer.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)];

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xfff3e0, 2.6);
    sun.position.set(-12, 22, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0004;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xc8d4ea, 0.5);
    fill.position.set(14, 8, -10);
    scene.add(fill);

    // Soft contact shadow only; no visible ground plane
    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.18 })
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.y = -0.02;
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false; // wheel and pinch keep scrolling the page
    controls.enablePan = false;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.6;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 8;
    controls.maxDistance = 120;
    controlsRef.current = controls;
    // OrbitControls sets touch-action: none; allow vertical swipes to scroll the page on phones
    canvas.style.touchAction = "pan-y";

    const stopAutoRotate = () => {
      controls.autoRotate = false;
    };
    canvas.addEventListener("pointerdown", stopAutoRotate);

    // Bounding sphere of the visible house, set once the model loads
    let fit: { center: THREE.Vector3; radius: number } | null = null;

    // Distance that keeps the whole sphere in view for the current frame shape
    function frameModel(dir: THREE.Vector3) {
      if (!fit) return;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const dist = (fit.radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.9;
      controls.target.copy(fit.center);
      camera.position.copy(fit.center).addScaledVector(dir, dist);
      controls.update();
    }

    function resize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Re-fit when the frame changes shape (e.g. entering full screen on a phone), keeping the view angle
      if (fit) frameModel(camera.position.clone().sub(controls.target).normalize());
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    let model: THREE.Object3D | null = null;
    let cancelled = false;
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      MODEL_URL,
      (gltf) => {
        model = gltf.scene;
        if (cancelled) {
          disposeObject(model);
          return;
        }
        model.traverse((c) => {
          if (HIDDEN_COLLECTIONS.includes(c.name)) c.visible = false;
          if ((c as THREE.Mesh).isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        scene.add(model);
        model.updateMatrixWorld(true);

        // Frame the visible house and plot, viewed from the front-left corner
        const box = new THREE.Box3();
        model.traverseVisible((c) => {
          if ((c as THREE.Mesh).isMesh) box.expandByObject(c);
        });
        // Fit the bounding sphere, so the house stays inside the frame at every rotation angle
        const { center, radius } = box.getBoundingSphere(new THREE.Sphere());
        fit = { center, radius };
        frameModel(new THREE.Vector3(-0.55, 0.35, 0.8).normalize());
        callbacks.current.onReady();
      },
      undefined,
      () => {
        if (!cancelled) callbacks.current.onError();
      }
    );

    // Only render while the hero is on screen
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

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointerdown", stopAutoRotate);
      controls.dispose();
      controlsRef.current = null;
      if (model) disposeObject(model);
      shadowCatcher.geometry.dispose();
      shadowCatcher.material.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-scene">
      <canvas ref={canvasRef} aria-label="3D model of the finished house. Drag to turn it." role="img" />
    </div>
  );
}
