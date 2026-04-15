import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';

function GoldenSphere() {
  const meshRef = useRef();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1.2, 0.45, 64, 128]} />
        <MeshDistortMaterial
          color={isDark ? '#fbbf24' : '#6366f1'}
          emissive={isDark ? '#b45309' : '#4338ca'}
          emissiveIntensity={isDark ? 0.4 : 0.2}
          metalness={0.9}
          roughness={0.15}
          distort={0.15}
          speed={1.5}
        />
      </mesh>
      {/* Inner coin */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.08, 64]} />
        <meshStandardMaterial
          color={isDark ? '#fde68a' : '#e0e7ff'}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Lights() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.8 : 1.2}
        color={isDark ? '#fbbf24' : '#ffffff'}
      />
      <pointLight
        position={[-3, -2, 2]}
        intensity={isDark ? 0.5 : 0.3}
        color={isDark ? '#8b5cf6' : '#6366f1'}
      />
    </>
  );
}

export default function FinancialCore() {
  return (
    <div className="w-full h-[320px] md:h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Lights />
        <GoldenSphere />
      </Canvas>
    </div>
  );
}
