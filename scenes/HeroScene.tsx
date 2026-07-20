import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, Center } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// 1. Cherry Blossom Petal 3D Mesh Component
// ==========================================
function Petal({ position, scale, speed, rotationSpeed }) {
  const meshRef = useRef();
  
  // Custom organic curved shape for low-poly cherry blossom petal extrusion
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    // Draw cherry blossom petal contours
    s.bezierCurveTo(-0.4, -0.4, -0.8, 0.3, 0, 1);
    s.bezierCurveTo(0.8, 0.3, 0.4, -0.4, 0, 0);
    return s;
  }, []);

  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02
  };

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle drift and rotate in 3D space
      meshRef.current.position.y -= speed * 0.01;
      meshRef.current.rotation.x += rotationSpeed * 0.005;
      meshRef.current.rotation.y += rotationSpeed * 0.003;
      
      // Loop petals when they float below viewport
      if (meshRef.current.position.y < -6) {
        meshRef.current.position.y = 6;
        meshRef.current.position.x = (Math.random() - 0.5) * 10;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      castShadow
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#EFA3BD" // Cherry-blossom pink
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ==========================================
// 2. Full 5-Petal 3D Cherry Blossom
// ==========================================
function CompleteBlossom({ position, scale }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle tumbling rotation for the full flower
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 5 Petals arranged in a circle */}
      {[0, 12, 24, 36, 48].map((angle, idx) => (
        <group key={idx} rotation={[0, 0, (angle * Math.PI) / 30]}>
          <mesh castShadow>
            {/* Extruded petal shape */}
            <coneGeometry args={[0.3, 0.9, 4]} />
            <meshStandardMaterial color="#EFA3BD" roughness={0.5} />
          </mesh>
        </group>
      ))}
      
      {/* Magenta flower center stamens */}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#C2477E" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ==========================================
// 3. Volumetric Drei Cloud Drift Component
// ==========================================
function DriftingClouds() {
  const cloudGroupRef = useRef();
  
  useFrame(() => {
    if (cloudGroupRef.current) {
      // Airy slow drift left to right
      cloudGroupRef.current.children.forEach(cloud => {
        cloud.position.x += 0.0025;
        if (cloud.position.x > 15) {
          cloud.position.x = -15; // reset on left
        }
      });
    }
  });

  // Soft cream clouds positioned at different depths
  const cloudsData = useMemo(() => [
    { pos: [-8, 2, -5], scale: 1.5, opacity: 0.15 },
    { pos: [-2, 3, -8], scale: 2.2, opacity: 0.2 },
    { pos: [5, 1.5, -4], scale: 1.8, opacity: 0.12 },
    { pos: [9, 3, -12], scale: 2.8, opacity: 0.25 },
    { pos: [-12, -1, -6], scale: 2.0, opacity: 0.18 }
  ], []);

  return (
    <group ref={cloudGroupRef}>
      {cloudsData.map((c, i) => (
        <group key={i} position={c.pos}>
          {/* Volumetric Drei Cloud representation */}
          <mesh>
            <sphereGeometry args={[1.5 * c.scale, 16, 16]} />
            <meshStandardMaterial
              color="#FBF9F4" // Soft cream cloud
              transparent
              opacity={c.opacity}
              roughness={0.9}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// 4. Camera Damped Parallax Mouse Response
// ==========================================
function CameraParallax() {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
    // Elegant damping camera offset based on mouse location
    camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// ==========================================
// 5. Main Hero WebGL Scene Component
// ==========================================
export default function HeroScene() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Spawn random positional data for 20 drifting blossom petals
  const petalsData = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      ],
      scale: Math.random() * 0.3 + 0.15,
      speed: Math.random() * 0.5 + 0.3,
      rotationSpeed: Math.random() * 1.5 - 0.75
    }));
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* React Three Fiber WebGL Canvas (HTML Overlay removed to prevent duplication) */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Deep Emerald (#0A4A40) backdrop fog */}
        <color attach="background" args={['#0A4A40']} />
        <fog attach="fog" args={['#0A4A40', 4, 15]} />

        {/* Ambient + Warm Direct Lights */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Soft Pink Accent Backlight */}
        <pointLight position={[-5, -2, -3]} color="#EBA9C3" intensity={0.8} />

        {/* Parallax damped camera controller */}
        <CameraParallax />

        {/* Drifting Drei Clouds */}
        <DriftingClouds />

        {/* Dynamic floating cherry petals */}
        <group>
          {petalsData.map((p, i) => (
            <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
              <Petal
                position={p.pos}
                scale={p.scale}
                speed={p.speed}
                rotationSpeed={p.rotationSpeed}
              />
            </Float>
          ))}
        </group>

        {/* Logo centerpiece floating beneath the typography overlay */}
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.0}>
          <CompleteBlossom position={[0, -1.8, 0.5]} scale={1.2} />
        </Float>
      </Canvas>
    </div>
  );
}
