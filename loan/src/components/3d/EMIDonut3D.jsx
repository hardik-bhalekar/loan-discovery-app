import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';

function DonutRing({ ratio, color, emissive, radius = 1.0, tube = 0.35, rotationOffset = 0 }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
      ref.current.rotation.x += delta * 0.15;
    }
  });

  // Arc length proportional to ratio (full circle = 2π)
  const arc = Math.PI * 2 * Math.max(ratio, 0.05);

  return (
    <mesh ref={ref} rotation={[0.5, rotationOffset, 0]}>
      <torusGeometry args={[radius, tube, 32, 64, arc]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.35}
        metalness={0.7}
        roughness={0.25}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function DonutScene({ principalRatio }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const interestRatio = 1 - principalRatio;

  return (
    <>
      <ambientLight intensity={isDark ? 0.35 : 0.6} />
      <directionalLight position={[3, 4, 5]} intensity={isDark ? 0.9 : 1.1} />
      <pointLight
        position={[-2, -1, 3]}
        intensity={0.5}
        color={isDark ? '#a78bfa' : '#818cf8'}
      />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        {/* Principal ring */}
        <DonutRing
          ratio={principalRatio}
          color={isDark ? '#6366f1' : '#4f46e5'}
          emissive={isDark ? '#4338ca' : '#3730a3'}
          radius={1.0}
          tube={0.32}
          rotationOffset={0}
        />
        {/* Interest ring */}
        <DonutRing
          ratio={interestRatio}
          color={isDark ? '#8b5cf6' : '#7c3aed'}
          emissive={isDark ? '#6d28d9' : '#5b21b6'}
          radius={1.0}
          tube={0.32}
          rotationOffset={Math.PI * 2 * principalRatio}
        />
      </Float>
    </>
  );
}

export default function EMIDonut3D({ principal = 0.6, interest = 0.4 }) {
  const total = principal + interest || 1;
  const principalRatio = principal / total;

  return (
    <div className="w-full h-[200px]">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <DonutScene principalRatio={principalRatio} />
      </Canvas>
    </div>
  );
}
