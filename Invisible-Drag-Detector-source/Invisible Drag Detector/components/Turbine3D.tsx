'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Utility-scale turbine digital twin.
 * The proportions are intentionally based on a modern 3-bladed onshore turbine:
 * slim tapered tower, compact rounded nacelle, spherical hub and long tapered blades.
 */
function Blade({ index, severe }: { index: number; severe: boolean }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Long, swept, tapered blade. Root is narrow; the airfoil widens slightly
    // through the inner third and tapers hard toward the tip.
    s.moveTo(-0.055, 0.02);
    s.lineTo(0.055, 0.02);
    s.lineTo(0.17, 0.55);
    s.lineTo(0.25, 1.25);
    s.lineTo(0.19, 2.15);
    s.lineTo(0.08, 3.05);
    s.lineTo(-0.02, 3.35);
    s.lineTo(-0.08, 2.95);
    s.lineTo(-0.12, 2.1);
    s.lineTo(-0.12, 1.25);
    s.lineTo(-0.095, 0.55);
    s.closePath();
    return s;
  }, []);

  return (
    <group rotation={[0, 0, index * ((Math.PI * 2) / 3)]}>
      <mesh castShadow position={[0, 1.66, 0]} rotation={[0, 0, -0.055]}>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.075,
              bevelEnabled: true,
              bevelSegments: 3,
              bevelSize: 0.018,
              bevelThickness: 0.018,
            },
          ]}
        />
        <meshStandardMaterial
          color={severe ? '#f1a4ad' : '#e8edf0'}
          metalness={0.15}
          roughness={0.58}
          emissive={severe ? '#5b0e19' : '#09131a'}
          emissiveIntensity={severe ? 0.16 : 0.02}
        />
      </mesh>
    </group>
  );
}

function Rotor({ speed, severe }: { speed: number; severe: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      // Keep the rotor visibly moving without making it look like a propeller toy.
      ref.current.rotation.z += delta * (0.42 + Math.min(speed, 18) * 0.095);
    }
  });

  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <Blade key={i} index={i} severe={severe} />
      ))}
      <mesh castShadow>
        <sphereGeometry args={[0.31, 32, 24]} />
        <meshStandardMaterial color="#d6dde0" metalness={0.45} roughness={0.28} />
      </mesh>
    </group>
  );
}

function Nacelle({ severe }: { severe: boolean }) {
  return (
    <group>
      {/* Main rounded nacelle body, elongated along the rotor shaft. */}
      <mesh castShadow position={[0, 5.45, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.5, 1.55, 8, 24]} />
        <meshStandardMaterial
          color="#d9e0e3"
          metalness={0.25}
          roughness={0.48}
        />
      </mesh>

      {/* Slightly darker underside / machinery housing. */}
      <mesh castShadow position={[0, 5.17, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.43, 0.5, 1.6, 24]} />
        <meshStandardMaterial color="#89979d" metalness={0.42} roughness={0.46} />
      </mesh>

      {/* Small top service fairing. */}
      <mesh castShadow position={[0, 5.96, -0.18]}>
        <boxGeometry args={[0.72, 0.14, 0.78]} />
        <meshStandardMaterial color="#edf2f3" metalness={0.18} roughness={0.5} />
      </mesh>

      {/* Rear cooling cap. */}
      <mesh position={[0, 5.43, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.39, 0.46, 0.22, 24]} />
        <meshStandardMaterial color="#66767d" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Subtle stress glow around the drivetrain/shaft area. */}
      {severe && (
        <mesh position={[0, 5.45, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.025, 12, 64]} />
          <meshBasicMaterial color="#ff536c" transparent opacity={0.82} />
        </mesh>
      )}
    </group>
  );
}

function TurbineScene({ speed, offset }: { speed: number; offset: number }) {
  const yaw = THREE.MathUtils.degToRad(offset);
  const severe = Math.abs(offset) >= 7;

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [7.8, 4.8, 9.8], fov: 34 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#071019']} />
      <fog attach="fog" args={['#071019', 12, 27]} />

      <hemisphereLight intensity={1.55} color="#e8f7ff" groundColor="#071019" />
      <directionalLight
        castShadow
        position={[6, 11, 7]}
        intensity={3.5}
        color="#fffdf7"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -4]} intensity={1.0} color="#8edfff" />
      <pointLight position={[0, 5.2, 2.0]} intensity={severe ? 12 : 3} color={severe ? '#ff536c' : '#7de8f5'} />

      {/* Dark matte terrain instead of the old toy-like circular platform. */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#09141b" roughness={0.96} metalness={0.02} />
      </mesh>
      <gridHelper args={[18, 18, '#173041', '#0d202c']} position={[0, 0.015, 0]} />

      <group rotation={[0, yaw, 0]}>
        {/* Tall, slender tapered tower matching a real onshore utility turbine. */}
        <mesh castShadow receiveShadow position={[0, 2.65, 0]}>
          <cylinderGeometry args={[0.235, 0.48, 5.25, 40]} />
          <meshStandardMaterial color="#c8d0d3" metalness={0.2} roughness={0.52} />
        </mesh>

        {/* Foundation collar. */}
        <mesh receiveShadow position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.68, 0.78, 0.24, 40]} />
          <meshStandardMaterial color="#4d5b60" metalness={0.3} roughness={0.72} />
        </mesh>

        <Nacelle severe={severe} />

        {/* Hub sits directly on the front of the nacelle. Rotor plane is XY,
            so the viewer gets the familiar real-world wind-turbine silhouette. */}
        <group position={[0, 5.45, 1.38]}>
          <mesh castShadow>
            <sphereGeometry args={[0.46, 32, 24]} />
            <meshStandardMaterial color="#dce3e5" metalness={0.35} roughness={0.28} />
          </mesh>
          <mesh castShadow position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.31, 0.66, 32]} />
            <meshStandardMaterial color="#eef2f2" metalness={0.28} roughness={0.3} />
          </mesh>
          <Rotor speed={speed} severe={severe} />
        </group>
      </group>

      <ContactShadows
        position={[0, 0.03, 0]}
        opacity={0.55}
        scale={10}
        blur={2.8}
        far={8}
      />

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={14}
        minPolarAngle={0.75}
        maxPolarAngle={1.48}
        target={[0, 3.05, 0]}
      />
    </Canvas>
  );
}

export default function Turbine3D(props: { speed: number; offset: number }) {
  return <div className="h-full w-full overflow-hidden rounded-2xl"><TurbineScene {...props} /></div>;
}
