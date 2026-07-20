import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// ==========================================
// 1. Cherry Blossom Petal 3D Mesh Component
// ==========================================
function Petal({ position, scale, speed, rotationSpeed }) {
  const meshRef = useRef();
  
  // Custom unique floating offset to stagger waves
  const offset = useMemo(() => Math.random() * 100, []);
  
  // Curved shape for low-poly petal
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
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
      const time = state.clock.getElapsedTime();
      
      // Native, high-performance R3F mathematical float sway (Float equivalent)
      const floatSwayX = Math.sin(time * 0.8 + offset) * 0.003;
      const floatSwayY = Math.cos(time * 0.5 + offset) * 0.002;

      meshRef.current.position.y -= speed * 0.007 + floatSwayY;
      meshRef.current.position.x += floatSwayX;
      meshRef.current.rotation.x += rotationSpeed * 0.005;
      meshRef.current.rotation.y += rotationSpeed * 0.003;
      
      // Loop petals when they float below viewport
      if (meshRef.current.position.y < -6) {
        meshRef.current.position.y = 6;
        meshRef.current.position.x = (Math.random() - 0.5) * 10;
      }
    }
  });

  return React.createElement(
    'mesh',
    {
      ref: meshRef,
      position: position,
      scale: scale,
      castShadow: true
    },
    React.createElement('extrudeGeometry', { args: [shape, extrudeSettings] }),
    React.createElement('meshStandardMaterial', {
      color: '#EFA3BD', // Cherry-blossom pink
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.DoubleSide
    })
  );
}

// ==========================================
// 2. Full 5-Petal 3D Cherry Blossom (Centerpiece)
// ==========================================
function CompleteBlossom({ position, scale }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Native, organic three-dimensional floating sway
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
      groupRef.current.position.x = position[0] + Math.cos(time * 0.4) * 0.08;
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.z += 0.002;
    }
  });

  return React.createElement(
    'group',
    { ref: groupRef, position: position, scale: scale },
    [0, 12, 24, 36, 48].map((angle, idx) => 
      React.createElement(
        'group',
        { key: idx, rotation: [0, 0, (angle * Math.PI) / 30] },
        React.createElement(
          'mesh',
          { castShadow: true },
          React.createElement('coneGeometry', { args: [0.3, 0.9, 4] }),
          React.createElement('meshStandardMaterial', { color: '#EFA3BD', roughness: 0.5 })
        )
      )
    ),
    React.createElement(
      'mesh',
      { position: [0, 0, 0.1] },
      React.createElement('sphereGeometry', { args: [0.2, 8, 8] }),
      React.createElement('meshStandardMaterial', { color: '#C2477E', roughness: 0.4 })
    )
  );
}

// ==========================================
// 3. Volumetric Drift Clouds Component
// ==========================================
function DriftingClouds() {
  const cloudGroupRef = useRef();
  
  useFrame(() => {
    if (cloudGroupRef.current) {
      cloudGroupRef.current.children.forEach(cloud => {
        cloud.position.x += 0.0025;
        if (cloud.position.x > 15) {
          cloud.position.x = -15;
        }
      });
    }
  });

  const cloudsData = useMemo(() => [
    { pos: [-8, 2, -5], scale: 1.5, opacity: 0.15 },
    { pos: [-2, 3, -8], scale: 2.2, opacity: 0.2 },
    { pos: [5, 1.5, -4], scale: 1.8, opacity: 0.12 },
    { pos: [9, 3, -12], scale: 2.8, opacity: 0.25 },
    { pos: [-12, -1, -6], scale: 2.0, opacity: 0.18 }
  ], []);

  return React.createElement(
    'group',
    { ref: cloudGroupRef },
    cloudsData.map((c, i) => 
      React.createElement(
        'group',
        { key: i, position: c.pos },
        React.createElement(
          'mesh',
          null,
          React.createElement('sphereGeometry', { args: [1.5 * c.scale, 16, 16] }),
          React.createElement('meshStandardMaterial', {
            color: '#FBF9F4',
            transparent: true,
            opacity: c.opacity,
            roughness: 0.9,
            depthWrite: false
          })
        )
      )
    )
  );
}

// ==========================================
// 4. Camera Damped Parallax Mouse Response
// ==========================================
function CameraParallax() {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
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

  return React.createElement(
    'div',
    { style: { width: '100%', height: '100%', position: 'relative' } },
    
    // R3F Canvas Viewport (HTML Text overlay removed to prevent duplication)
    React.createElement(
      Canvas,
      {
        shadows: true,
        camera: { position: [0, 0, 5], fov: 75 },
        style: { width: '100%', height: '100%' }
      },
      React.createElement('color', { attach: 'background', args: ['#0A4A40'] }),
      React.createElement('fog', { attach: 'fog', args: ['#0A4A40', 4, 15] }),
      React.createElement('ambientLight', { intensity: 0.45 }),
      React.createElement('directionalLight', {
        position: [5, 8, 5],
        intensity: 1.2,
        castShadow: true,
        'shadow-mapSize': [1024, 1024]
      }),
      React.createElement('pointLight', { position: [-5, -2, -3], color: '#EBA9C3', intensity: 0.8 }),
      React.createElement(CameraParallax, null),
      React.createElement(DriftingClouds, null),
      React.createElement(
        'group',
        null,
        petalsData.map((p, i) => 
          React.createElement(Petal, {
            key: i,
            position: p.pos,
            scale: p.scale,
            speed: p.speed,
            rotationSpeed: p.rotationSpeed
          })
        )
      ),
      React.createElement(CompleteBlossom, { position: [0, -1.8, 0.5], scale: 1.2 })
    )
  );
}
