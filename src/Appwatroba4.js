import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, ContactShadows, Environment, OrbitControls } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"

const state = proxy({
  current: null,
  items: {
    osłona: "#ffffff",
    filtry: "#ffffff",
    żyła: "#ffffff",
    rozdzielacze: "#ffffff",
    woreczek: "#ffffff",
    uszczelki: "#ffffff",
  },
})

export default function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.0} />
        <spotLight intensity={0.1} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <Wątroba />
        <Environment preset="studio" />
        <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={true} enablePan={false} />
      </Canvas>
      <Picker />
    </>
  )
}

function Wątroba() {
  const ref = useRef()
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("wątroba4.glb")
  const [hovered, set] = useState(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
  })

  return (
    <group
      ref={ref}
      onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}>
      <mesh receiveShadow castShadow geometry={nodes.osłona.geometry} material={materials.osłona} material-color={snap.items.osłona} />
      <mesh receiveShadow castShadow geometry={nodes.filtry.geometry} material={materials.filtry} material-color={snap.items.filtry} />
      <mesh receiveShadow castShadow geometry={nodes.żyła.geometry} material={materials.żyła} material-color={snap.items.żyła} />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.rozdzielacze.geometry}
        material={materials.rozdzielacze}
        material-color={snap.items.rozdzielacze}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.woreczek.geometry}
        material={materials.woreczek}
        material-color={snap.items.woreczek}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.uszczelki.geometry}
        material={materials.uszczelki}
        material-color={snap.items.uszczelki}
      />
    </group>
  )
}

function Picker() {
  const snap = useSnapshot(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}
