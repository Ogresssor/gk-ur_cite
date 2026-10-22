"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Сфера-сеть: узлы трёх цветов (Битрикс24, 1С, слаботочка), связи между соседями
// и импульсы, бегущие по связям. Реагирует на курсор, спит вне экрана.

const COLORS = [new THREE.Color("#5b8cff"), new THREE.Color("#f5b400"), new THREE.Color("#22c58b")];
const NODES = 420;
const RADIUS = 2.2;
const LINK_DIST = 0.52;
const PULSES = 70;

// Круглая мягкая точка вместо квадрата по умолчанию
function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = golden * i;
    // Небольшой шум, чтобы сетка не выглядела идеальной решёткой
    const jitter = 1 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.06;
    pts.push(new THREE.Vector3(Math.cos(t) * rad * r * jitter, y * r * jitter, Math.sin(t) * rad * r * jitter));
  }
  return pts;
}

export default function HeroScene({ onReady, paused = false }: { onReady?: () => void; paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    startRef.current();
  }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // Нет WebGL — остаётся статичный постер
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const group = new THREE.Group();
    scene.add(group);

    // Узлы
    const pts = fibonacciSphere(NODES, RADIUS);
    const nodeColors = pts.map((_, i) => COLORS[(i * 7) % 3]);
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(pts);
    nodeGeo.setAttribute("color", new THREE.Float32BufferAttribute(nodeColors.flatMap((c) => [c.r, c.g, c.b]), 3));
    const dot = dotTexture();
    const nodeMat = new THREE.PointsMaterial({
      map: dot,
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // Связи между близкими узлами
    const links: [number, number][] = [];
    const linePos: number[] = [];
    const lineCol: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < LINK_DIST) {
          links.push([i, j]);
          linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          const a = nodeColors[i];
          const b = nodeColors[j];
          lineCol.push(a.r, a.g, a.b, b.r, b.g, b.b);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineCol, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Орбиты вокруг сферы
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    [2.9, 3.4].forEach((r, k) => {
      const curve = new THREE.EllipseCurve(0, 0, r, r * 0.32, 0, Math.PI * 2);
      const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(curve.getPoints(160)), orbitMat);
      orbit.rotation.x = Math.PI / 2.3 + k * 0.25;
      orbit.rotation.z = k * 0.6;
      group.add(orbit);
    });

    // Импульсы, бегущие по связям
    const pulseLinks = Array.from({ length: PULSES }, (_, k) => links[(k * 131) % links.length]);
    const pulseOffset = pulseLinks.map((_, k) => (k * 0.618) % 1);
    const pulsePos = new Float32Array(PULSES * 3);
    const pulseCol = new Float32Array(PULSES * 3);
    pulseLinks.forEach(([a], k) => {
      const c = nodeColors[a];
      pulseCol.set([c.r, c.g, c.b], k * 3);
    });
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseCol, 3));
    const pulseMat = new THREE.PointsMaterial({
      map: dot,
      size: 0.2,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pulseGeo, pulseMat));

    const tmp = new THREE.Vector3();
    const placePulses = (t: number) => {
      pulseLinks.forEach(([a, b], k) => {
        const p = (t * 0.35 + pulseOffset[k]) % 1;
        tmp.lerpVectors(pts[a], pts[b], p);
        pulsePos[k * 3] = tmp.x;
        pulsePos[k * 3 + 1] = tmp.y;
        pulsePos[k * 3 + 2] = tmp.z;
      });
      pulseGeo.attributes.position.needsUpdate = true;
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / Math.max(h, 1);
      // На узком экране сфера уходит вниз и вглубь, чтобы не мешать тексту
      const narrow = camera.aspect < 0.8;
      camera.position.z = narrow ? 10.5 : 8;
      group.position.set(narrow ? 0.6 : 0.3, narrow ? -2.6 : 0, 0);
      camera.updateProjectionMatrix();
      // setSize очищает canvas: перерисовываем кадр, иначе на паузе сфера пропадёт
      renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Курсор слегка наклоняет сферу
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Не чаще ~45 кадров в секунду: сцена спокойная, а батарея и CPU целее
      if (now - last < 22) return;
      last = now;
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.08 + target.x;
      group.rotation.x += (target.y - group.rotation.x) * 0.04;
      placePulses(t);
      renderer.render(scene, camera);
    };

    placePulses(0.4);
    group.rotation.set(0.15, 0.6, 0);
    renderer.render(scene, camera);
    onReady?.();

    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduce && !pausedRef.current && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    startRef.current = start;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(mount);
    document.addEventListener("visibilitychange", start);

    return () => {
      startRef.current = () => {};
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Points || obj instanceof THREE.LineSegments || obj instanceof THREE.LineLoop) {
          obj.geometry.dispose();
        }
      });
      [nodeMat, lineMat, orbitMat, pulseMat].forEach((m) => m.dispose());
      dot.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
