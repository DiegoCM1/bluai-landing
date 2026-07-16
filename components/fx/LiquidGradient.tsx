"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive "liquid gradient" WebGL backdrop for the contact section.
 *
 * Faithful port of the reference pen using its DEFAULT color scheme
 * (Scheme 1: orange #F15A22 over navy #0a0e27). It keeps the original
 * multi-center animated gradient, film grain and the mouse-driven ripple
 * distortion (via a small "touch texture"). The pen's demo chrome
 * (color pickers, custom cursor, heading) is intentionally omitted.
 *
 * The animation and pointer interaction are disabled for users who prefer
 * reduced motion — a single static frame is drawn instead.
 */

// --- Mouse trail texture --------------------------------------------------
// Paints a fading trail of the pointer into a small canvas that the shader
// samples to bend the gradient where the cursor moves.
class TouchTexture {
  size = 64;
  width = 64;
  height = 64;
  maxAge = 64;
  radius = 0.25 * 64;
  speed = 1 / 64;
  trail: { x: number; y: number; age: number; force: number; vx: number; vy: number }[] = [];
  last: { x: number; y: number } | null = null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.Texture;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const f = point.force * this.speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) this.trail.splice(i, 1);
      else this.drawPoint(point);
    }
    this.texture.needsUpdate = true;
  }

  addTouch(x: number, y: number) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;
      force = Math.min(dd * 20000, 2.0);
    }
    this.last = { x, y };
    this.trail.push({ x, y, age: 0, force, vx, vy });
  }

  drawPoint(point: { x: number; y: number; age: number; force: number; vx: number; vy: number }) {
    const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = this.radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Fragment shader ported verbatim from the reference pen.
const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  uniform vec3 uColor6;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform sampler2D uTouchTexture;
  uniform float uGrainIntensity;
  uniform vec3 uDarkNavy;
  uniform float uGradientSize;
  uniform float uGradientCount;
  uniform float uColor1Weight;
  uniform float uColor2Weight;

  varying vec2 vUv;

  float grain(vec2 uv, float time) {
    vec2 grainUv = uv * uResolution * 0.5;
    float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
    return grainValue * 2.0 - 1.0;
  }

  vec3 getGradientColor(vec2 uv, float time) {
    float gradientRadius = uGradientSize;

    vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
    vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
    vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
    vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
    vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
    vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
    vec2 center7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
    vec2 center8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
    vec2 center9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
    vec2 center10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
    vec2 center11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
    vec2 center12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);

    float influence1 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center1));
    float influence2 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center2));
    float influence3 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center3));
    float influence4 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center4));
    float influence5 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center5));
    float influence6 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center6));
    float influence7 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center7));
    float influence8 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center8));
    float influence9 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center9));
    float influence10 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center10));
    float influence11 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center11));
    float influence12 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center12));

    vec2 rotatedUv1 = uv - 0.5;
    float angle1 = time * uSpeed * 0.15;
    rotatedUv1 = vec2(rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1), rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1));
    rotatedUv1 += 0.5;

    vec2 rotatedUv2 = uv - 0.5;
    float angle2 = -time * uSpeed * 0.12;
    rotatedUv2 = vec2(rotatedUv2.x * cos(angle2) - rotatedUv2.y * sin(angle2), rotatedUv2.x * sin(angle2) + rotatedUv2.y * cos(angle2));
    rotatedUv2 += 0.5;

    float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, length(rotatedUv1 - 0.5));
    float radialInfluence2 = 1.0 - smoothstep(0.0, 0.8, length(rotatedUv2 - 0.5));

    vec3 color = vec3(0.0);
    color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
    color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
    color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
    color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
    color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
    color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;

    if (uGradientCount > 6.0) {
      color += uColor1 * influence7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
      color += uColor2 * influence8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
      color += uColor3 * influence9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
      color += uColor4 * influence10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
    }
    if (uGradientCount > 10.0) {
      color += uColor5 * influence11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
      color += uColor6 * influence12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
    }

    color += mix(uColor1, uColor3, radialInfluence1) * 0.45 * uColor1Weight;
    color += mix(uColor2, uColor4, radialInfluence2) * 0.4 * uColor2Weight;

    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;

    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.35);
    color = pow(color, vec3(0.92));

    float brightness1 = length(color);
    float mixFactor1 = max(brightness1 * 1.2, 0.15);
    color = mix(uDarkNavy, color, mixFactor1);

    float brightnessCap = length(color);
    if (brightnessCap > 1.0) color = color * (1.0 / brightnessCap);

    return color;
  }

  void main() {
    vec2 uv = vUv;

    vec4 touchTex = texture2D(uTouchTexture, uv);
    float vx = -(touchTex.r * 2.0 - 1.0);
    float vy = -(touchTex.g * 2.0 - 1.0);
    float intensity = touchTex.b;
    uv.x += vx * 0.8 * intensity;
    uv.y += vy * 0.8 * intensity;

    vec2 center = vec2(0.5);
    float dist = length(uv - center);
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * intensity;
    float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * intensity;
    uv += vec2(ripple + wave);

    vec3 color = getGradientColor(uv, uTime);

    float grainValue = grain(uv, uTime);
    color += grainValue * uGrainIntensity;

    float timeShift = uTime * 0.5;
    color.r += sin(timeShift) * 0.02;
    color.g += cos(timeShift * 1.4) * 0.02;
    color.b += sin(timeShift * 1.2) * 0.02;

    float brightness2 = length(color);
    float mixFactor2 = max(brightness2 * 1.2, 0.15);
    color = mix(uDarkNavy, color, mixFactor2);

    color = clamp(color, vec3(0.0), vec3(1.0));
    float brightnessCap = length(color);
    if (brightnessCap > 1.0) color = color * (1.0 / brightnessCap);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Six-stop palettes the gradient can flow through.
const PALETTES = {
  // Secondary palette — contact section.
  secondary: [
    new THREE.Vector3(0.573, 0.0, 1.0), // #9200ff purple
    new THREE.Vector3(1.0, 0.522, 0.0), // #ff8500 orange
    new THREE.Vector3(0.0, 0.906, 0.455), // #00e774 green
    new THREE.Vector3(1.0, 0.808, 0.0), // #ffce00 yellow
    new THREE.Vector3(0.306, 0.835, 0.871), // #4ed5de teal
    new THREE.Vector3(0.886, 0.263, 0.216), // #e24337 red
  ],
  // Primary palette — membership section (brand blues).
  primary: [
    new THREE.Vector3(0.192, 0.404, 1.0), // #3167ff blue
    new THREE.Vector3(0.18, 0.792, 1.0), // #2ecaff cyan
    new THREE.Vector3(0.224, 0.0, 1.0), // #3900ff indigo
    new THREE.Vector3(0.498, 0.878, 1.0), // light cyan
    new THREE.Vector3(0.192, 0.404, 1.0), // #3167ff blue
    new THREE.Vector3(0.106, 0.176, 0.722), // deep blue
  ],
} as const;

// Dark base behind the colors.
const NAVY = new THREE.Vector3(0.039, 0.06, 0.18); // #0a0f2e

export default function LiquidGradient({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?: keyof typeof PALETTES;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const touch = new TouchTexture();

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: PALETTES[variant][0].clone() },
      uColor2: { value: PALETTES[variant][1].clone() },
      uColor3: { value: PALETTES[variant][2].clone() },
      uColor4: { value: PALETTES[variant][3].clone() },
      uColor5: { value: PALETTES[variant][4].clone() },
      uColor6: { value: PALETTES[variant][5].clone() },
      uSpeed: { value: 1.3 },
      uIntensity: { value: 1.7 },
      uTouchTexture: { value: touch.texture },
      uGrainIntensity: { value: 0.07 },
      uDarkNavy: { value: NAVY.clone() },
      uGradientSize: { value: 0.5 },
      uGradientCount: { value: 12.0 },
      uColor1Weight: { value: 1.0 },
      uColor2Weight: { value: 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Map pointer position to local UV (origin bottom-left) for the trail.
    const onPointer = (clientX: number, clientY: number) => {
      const rect = mount.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      touch.addTouch(x, y);
    };
    const onMouse = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => onPointer(e.touches[0].clientX, e.touches[0].clientY);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let startTime: number | null = null;

    if (reduce) {
      uniforms.uTime.value = 8;
      renderer.render(scene, camera);
    } else {
      window.addEventListener("mousemove", onMouse);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      const render = (now: number) => {
        if (startTime === null) startTime = now;
        uniforms.uTime.value = (now - startTime) / 1000;
        touch.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouchMove);
      mesh.geometry.dispose();
      material.dispose();
      touch.texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return <div ref={mountRef} className={className} aria-hidden />;
}
