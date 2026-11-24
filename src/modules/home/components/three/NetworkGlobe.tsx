"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 2;
const BRAND = "#ff7a3d";
const ACCENT = "#7c8cff";
const GRID = "#9aa4b8";

type Place = { name: string; lat: number; lon: number };

const HUB: Place = { name: "Albi", lat: 43.93, lon: 2.15 };

const NODES: Place[] = [
  { name: "Paris", lat: 48.85, lon: 2.35 },
  { name: "Londres", lat: 51.5, lon: -0.12 },
  { name: "Francfort", lat: 50.11, lon: 8.68 },
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "San Francisco", lat: 37.77, lon: -122.42 },
  { name: "Sao Paulo", lat: -23.55, lon: -46.63 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Mumbai", lat: 19.07, lon: 72.87 },
  { name: "Singapour", lat: 1.35, lon: 103.82 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Sydney", lat: -33.86, lon: 151.2 },
  { name: "Johannesburg", lat: -26.2, lon: 28.04 },
  { name: "Montreal", lat: 45.5, lon: -73.57 },
];

function latLonToVector(lat: number, lon: number, radius = RADIUS) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function buildArc(from: THREE.Vector3, to: THREE.Vector3) {
  const distance = from.distanceTo(to);
  const control = from
    .clone()
    .add(to)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(RADIUS + distance * 0.55);
  return new THREE.QuadraticBezierCurve3(from, control, to);
}

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const angle = golden * i;
    positions[i * 3] = Math.cos(angle) * ring * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(angle) * ring * radius;
  }
  return positions;
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { glow: { value: new THREE.Color(BRAND) } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 glow;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(glow, 1.0) * clamp(intensity, 0.0, 1.0) * 0.9;
          }
        `,
      }),
    [],
  );

  return (
    <mesh scale={1.18} material={material}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
    </mesh>
  );
}

function Dots() {
  const positions = useMemo(() => fibonacciSphere(2600, RADIUS), []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={GRID} size={0.028} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function Marker({ position, hub = false, phase = 0 }: { position: THREE.Vector3; hub?: boolean; phase?: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const elapsed = useRef(phase);

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (!ring.current) return;
    const cycle = (elapsed.current * (hub ? 0.8 : 0.5)) % 1;
    const scale = 1 + cycle * (hub ? 3.2 : 2.2);
    ring.current.scale.setScalar(scale);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.7;
  });

  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[hub ? 0.05 : 0.026, 16, 16]} />
        <meshBasicMaterial color={hub ? "#ffffff" : BRAND} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[hub ? 0.07 : 0.04, hub ? 0.082 : 0.048, 40]} />
        <meshBasicMaterial color={hub ? BRAND : ACCENT} transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Packet({ curve, speed, offset, color }: { curve: THREE.QuadraticBezierCurve3; speed: number; offset: number; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const elapsed = useRef(offset);

  useFrame((_, delta) => {
    elapsed.current += delta * speed;
    if (!mesh.current) return;
    const t = elapsed.current % 1;
    mesh.current.position.copy(curve.getPoint(t));
    const fade = Math.sin(t * Math.PI);
    mesh.current.scale.setScalar(0.5 + fade * 0.7);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.022, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function Network() {
  const hubPosition = useMemo(() => latLonToVector(HUB.lat, HUB.lon), []);

  const links = useMemo(
    () =>
      NODES.map((node, index) => {
        const target = latLonToVector(node.lat, node.lon);
        const curve = buildArc(hubPosition, target);
        return {
          node,
          target,
          curve,
          points: curve.getPoints(56),
          speed: 0.16 + (index % 5) * 0.035,
          offset: (index * 0.37) % 1,
        };
      }),
    [hubPosition],
  );

  return (
    <>
      <Marker position={hubPosition} hub />
      {links.map(({ node, target, curve, points, speed, offset }, index) => (
        <group key={node.name}>
          <Line points={points} color={BRAND} lineWidth={1} transparent opacity={0.35} />
          <Marker position={target} phase={index * 0.31} />
          <Packet curve={curve} speed={speed} offset={offset} color="#ffd3b8" />
          <Packet curve={curve} speed={speed * 0.8} offset={(offset + 0.5) % 1} color="#b9c2ff" />
        </group>
      ))}
    </>
  );
}

function Orbits() {
  const ringA = useRef<THREE.Group>(null);
  const ringB = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const list: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      list.push(new THREE.Vector3(Math.cos(a) * RADIUS * 1.32, 0, Math.sin(a) * RADIUS * 1.32));
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (ringA.current) ringA.current.rotation.y += delta * 0.12;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.08;
  });

  return (
    <>
      <group ref={ringA} rotation={[0.9, 0, 0.35]}>
        <Line points={points} color={GRID} lineWidth={0.8} transparent opacity={0.28} dashed dashSize={0.12} gapSize={0.12} />
        <mesh position={[RADIUS * 1.32, 0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ringB} rotation={[-0.5, 0, -0.6]} scale={1.1}>
        <Line points={points} color={BRAND} lineWidth={0.8} transparent opacity={0.22} />
        <mesh position={[-RADIUS * 1.32, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshBasicMaterial color={BRAND} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

function Globe({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (animate) elapsed.current += delta;
    const sway = animate ? Math.sin(elapsed.current * 0.15) * 0.7 : 0;
    const targetY = -Math.PI / 2 + sway + state.pointer.x * 0.45;
    const targetX = 0.38 - state.pointer.y * 0.25;
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 2.5);
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 2.5);
  });

  return (
    <group ref={group} rotation={[0.38, -Math.PI / 2, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
        <meshBasicMaterial color="#0b0d12" transparent opacity={0.92} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.992, 24, 24]} />
        <meshBasicMaterial color={GRID} wireframe transparent opacity={0.025} depthWrite={false} />
      </mesh>
      <Dots />
      <Network />
    </group>
  );
}

export default function NetworkGlobe({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8.6], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      aria-hidden="true"
    >
      <Atmosphere />
      <Globe animate={!reducedMotion} />
      <Orbits />
    </Canvas>
  );
}
