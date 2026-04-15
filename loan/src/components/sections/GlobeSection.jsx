import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import PageContainer from '../ui/PageContainer';
import SectionHeader from '../ui/SectionHeader';

const hotspots = [
  { city: 'Mumbai', lat: 19.076, lng: 72.8777, rate: 8.6, trend: 'Stable demand' },
  { city: 'Delhi NCR', lat: 28.7041, lng: 77.1025, rate: 8.9, trend: 'Demand rising' },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, rate: 8.7, trend: 'Tech-led growth' },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, rate: 8.8, trend: 'Auto finance up' },
  { city: 'Hyderabad', lat: 17.385, lng: 78.4867, rate: 8.75, trend: 'Strong home loans' },
];

function latLngToVector3(lat, lng, radius = 1.82) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeMesh() {
  const meshRef = useRef(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.13;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.75, 64, 64]} />
      <meshStandardMaterial color="#0f3f62" metalness={0.35} roughness={0.45} emissive="#114f68" emissiveIntensity={0.2} />
    </mesh>
  );
}

function PulseMarker({ city, lat, lng, rate, trend, onHover, active }) {
  const markerRef = useRef(null);
  const pulseRef = useRef(null);
  const position = useMemo(() => latLngToVector3(lat, lng, 1.85), [lat, lng]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) pulseRef.current.scale.setScalar(1 + Math.sin(t * 2.8) * 0.25);
    if (markerRef.current) markerRef.current.scale.setScalar(active ? 1.3 : 1);
  });

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover({ city, rate, trend });
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#f6c766" emissive="#f6c766" emissiveIntensity={active ? 1.4 : 0.8} />
      </mesh>
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.042, 0.065, 24]} />
        <meshBasicMaterial color="#f6c766" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ onHover, hovered }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight intensity={0.75} position={[4, 3, 3]} />
      <pointLight intensity={0.35} position={[-2, -1, -2]} color="#2c9cbf" />
      <GlobeMesh />
      {hotspots.map((item) => (
        <PulseMarker
          key={item.city}
          {...item}
          onHover={onHover}
          active={hovered?.city === item.city}
        />
      ))}
      <OrbitControls enablePan={false} minDistance={3.5} maxDistance={6.8} />
    </>
  );
}

export default function GlobeSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-16 sm:py-20">
      <PageContainer>
        <SectionHeader
          eyebrow="Market Rates and Trends"
          title="Interactive loan-rate globe"
          description="Hover hotspot markers to inspect regional lending trends and representative rate environments across major Indian markets."
          align="center"
          className="mb-8"
        />

        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-medium)] bg-[linear-gradient(160deg,rgba(11,49,71,0.95),rgba(5,29,48,0.95))] p-4 shadow-[0_20px_50px_rgba(5,24,43,0.4)] sm:p-6">
          <div className="h-[340px] sm:h-[420px]">
            <Canvas camera={{ position: [0, 0.2, 4.8], fov: 48 }} dpr={[1, 1.8]}>
              <Scene onHover={setHovered} hovered={hovered} />
            </Canvas>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
            <div className="rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-xs text-white/90 backdrop-blur">
              {hovered ? `${hovered.city}: ${hovered.rate.toFixed(2)}% - ${hovered.trend}` : 'Rotate and hover markers to inspect market hotspots'}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
