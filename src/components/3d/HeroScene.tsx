import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Icosahedron wireframe ────────────────────────────────────────────────────
function IcosahedronMesh({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.1
    ref.current.rotation.y += delta * 0.16
    // Subtle mouse influence
    ref.current.rotation.x += (mouse.y * 0.25 - ref.current.rotation.x) * 0.025
    ref.current.rotation.y += (mouse.x * 0.25 - ref.current.rotation.y) * 0.025
  })

  return (
    <mesh ref={ref} position={[-0.6, 0.2, 0]}>
      <icosahedronGeometry args={[1.7, 1]} />
      <meshBasicMaterial color="#e86d00" wireframe transparent opacity={0.2} />
    </mesh>
  )
}

// ── Particle field (sphere distribution) ────────────────────────────────────
function Particles({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null!)
  const COUNT = 2800

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 2 + Math.random() * 5.5
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi) - 0.5
    }
    return pos
  }, [])

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.032
    ref.current.rotation.x += delta * 0.007
    ref.current.rotation.x += mouse.y * 0.0004
    ref.current.rotation.y += mouse.x * 0.0004
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#ff7a28" transparent opacity={0.48} sizeAttenuation />
    </points>
  )
}

// ── Orbiting ring ────────────────────────────────────────────────────────────
function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    ref.current.rotation.z += delta * 0.22
    ref.current.rotation.x = 0.38 + Math.sin(state.clock.elapsedTime * 0.35) * 0.08
  })

  return (
    <mesh ref={ref} position={[-0.6, 0.2, 0]}>
      <torusGeometry args={[2.5, 0.0035, 6, 180]} />
      <meshBasicMaterial color="#ff7a28" transparent opacity={0.32} />
    </mesh>
  )
}

// ── Second smaller ring (counter-rotate) ────────────────────────────────────
function InnerRing() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    ref.current.rotation.z -= delta * 0.14
    ref.current.rotation.y = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15
  })

  return (
    <mesh ref={ref} position={[-0.6, 0.2, 0]}>
      <torusGeometry args={[1.3, 0.002, 6, 120]} />
      <meshBasicMaterial color="#ff7a28" transparent opacity={0.18} />
    </mesh>
  )
}

// ── Scene ────────────────────────────────────────────────────────────────────
function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <>
      <IcosahedronMesh mouse={mouse} />
      <Particles mouse={mouse} />
      <OrbitRing />
      <InnerRing />
    </>
  )
}

// ── Exported component ───────────────────────────────────────────────────────
export default function HeroScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 56 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene mouse={mouse} />
        </Canvas>
      </Suspense>
    </div>
  )
}
