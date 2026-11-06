import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { metalPalette, stoneHex, type BuilderKind, type DesignState } from "@/utils/customizer";
import { RotateCw, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

// Realistic Studio Environment generator for luxury jewelry reflections
function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv).texture;
    scene.environment = envTexture;

    return () => {
      envTexture.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}

// Interactive OrbitControls with smooth damping and optional auto-rotation
function Controls({ autoRotate, controlsRef }: { autoRotate: boolean; controlsRef: React.MutableRefObject<OrbitControls | null> }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.2;
    controls.maxDistance = 7.0;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.4;
    controls.maxPolarAngle = Math.PI / 2 + 0.25; // prevent going too far underneath the pedestal
    controlsRef.current = controls;

    return () => {
      controls.dispose();
    };
  }, [camera, gl, autoRotate, controlsRef]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}

// Helper to convert hex to Three.Color with realistic metal roughness/metalness
function getMetalMaterialProps(state: DesignState, metalKey: string) {
  const pal = metalPalette(state, metalKey);
  const finish = String(state.finish ?? "High Polish");
  const isMatte = finish === "Matte";
  const isAntique = finish === "Antique";
  const isOxidised = finish === "Oxidised";

  let baseColor = pal.base;
  let metalness = 0.98;
  let roughness = 0.12;

  if (isMatte) {
    roughness = 0.38;
    metalness = 0.88;
  } else if (isAntique) {
    baseColor = pal.dark;
    roughness = 0.32;
    metalness = 0.85;
  } else if (isOxidised) {
    baseColor = "#44464c";
    roughness = 0.45;
    metalness = 0.75;
  }

  return { color: baseColor, metalness, roughness };
}

// 3D Gemstone with realistic facets, high refractive index, and diamond dispersion
function FacetedGem({
  shape = "Round",
  color = "#f0f8ff",
  scale = 1,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}: {
  shape?: string;
  color?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const isDiamond = color.toLowerCase().includes("ea") || color.toLowerCase().includes("fa") || color.toLowerCase().includes("f0");

  const gemGeo = useMemo(() => {
    if (shape === "Princess") {
      const geo = new THREE.ConeGeometry(0.35, 0.45, 4);
      geo.rotateX(Math.PI);
      return geo;
    }
    if (shape === "Emerald") {
      const geo = new THREE.CylinderGeometry(0.3, 0.38, 0.35, 8);
      return geo;
    }
    if (shape === "Oval") {
      const geo = new THREE.SphereGeometry(0.35, 12, 10);
      geo.scale(1, 1.25, 0.8);
      return geo;
    }
    if (shape === "Pear") {
      const geo = new THREE.ConeGeometry(0.35, 0.55, 12);
      return geo;
    }
    if (shape === "Cushion") {
      const geo = new THREE.CylinderGeometry(0.34, 0.38, 0.3, 8);
      return geo;
    }
    // Brilliant Round
    return new THREE.ConeGeometry(0.38, 0.48, 16);
  }, [shape]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={gemGeo}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.05}
          roughness={0.03}
          transmission={isDiamond ? 0.6 : 0.4}
          ior={isDiamond ? 2.42 : 1.77}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          reflectivity={0.9}
          flatShading
        />
      </mesh>
      {/* Specular sparkle highlight */}
      <pointLight position={[0.2, 0.2, 0.3]} intensity={4.5} distance={1.5} color="#ffffff" />
    </group>
  );
}

// 3D Ring Object
function RingObject({ state }: { state: DesignState }) {
  const type = String(state.ringType || "Solitaire");
  const shape = String(state.shape || "Round");
  const stoneColor = stoneHex("ring", state);
  const hasStone = state.stone !== "None" && type !== "Signet";
  const metalProps = getMetalMaterialProps(state, "metal");
  const sizeScale = 0.9 + ((Number(state.size || 14) - 8) / 16) * 0.2;

  // Prongs positions
  const prongPositions: [number, number, number][] = [
    [-0.22, 1.15, -0.22],
    [0.22, 1.15, -0.22],
    [0.22, 1.15, 0.22],
    [-0.22, 1.15, 0.22],
  ];

  return (
    <group scale={sizeScale} position={[0, -0.15, 0]}>
      {/* Main Ring Shank Band */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.12, 32, 100]} />
        <meshStandardMaterial {...metalProps} />
      </mesh>

      {/* Inner comfort-fit bevel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.99, 0.08, 24, 80]} />
        <meshStandardMaterial {...metalProps} roughness={0.08} />
      </mesh>

      {/* Solitaire / Halo / Three-Stone Head Setting */}
      {type !== "Signet" && type !== "Eternity" && hasStone && (
        <group position={[0, 1.08, 0]}>
          {/* Gallery Basket Base Ring */}
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.045, 16, 32]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>

          {/* 4 Secure Claw Prongs */}
          {prongPositions.map((p, idx) => (
            <mesh key={idx} position={[p[0], p[1] - 1.08, p[2]]} rotation={[p[0] * 0.3, 0, -p[2] * 0.3]}>
              <cylinderGeometry args={[0.04, 0.045, 0.38, 12]} />
              <meshStandardMaterial {...metalProps} />
            </mesh>
          ))}

          {/* Main Center Gemstone */}
          <FacetedGem
            shape={shape}
            color={stoneColor}
            scale={type === "Cocktail" ? 1.4 : 1.15}
            position={[0, 0.12, 0]}
            rotation={[Math.PI, 0, 0]}
          />

          {/* Halo Diamonds */}
          {type === "Halo" &&
            Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const r = 0.54;
              return (
                <mesh key={i} position={[Math.cos(angle) * r, 0.04, Math.sin(angle) * r]}>
                  <sphereGeometry args={[0.052, 12, 10]} />
                  <meshPhysicalMaterial color="#ffffff" transmission={0.7} roughness={0.04} ior={2.4} clearcoat={1} />
                </mesh>
              );
            })}

          {/* Three-Stone Flanking Gems */}
          {type === "Three-Stone" && (
            <>
              <FacetedGem shape={shape} color={stoneColor} scale={0.65} position={[-0.48, -0.05, 0]} rotation={[Math.PI, 0, -0.2]} />
              <FacetedGem shape={shape} color={stoneColor} scale={0.65} position={[0.48, -0.05, 0]} rotation={[Math.PI, 0, 0.2]} />
            </>
          )}

          {/* Cocktail Cluster Accents */}
          {type === "Cocktail" &&
            Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = 0.72;
              return (
                <FacetedGem
                  key={i}
                  shape="Round"
                  color="#ffffff"
                  scale={0.4}
                  position={[Math.cos(angle) * r, -0.05, Math.sin(angle) * r]}
                  rotation={[Math.PI, 0, angle]}
                />
              );
            })}
        </group>
      )}

      {/* Eternity Band: Studded with stones all around the shank */}
      {type === "Eternity" &&
        Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const rx = Math.cos(a) * 1.0;
          const ry = Math.sin(a) * 1.0;
          return (
            <mesh key={i} position={[rx, ry, 0]} rotation={[0, 0, a + Math.PI / 2]}>
              <sphereGeometry args={[0.08, 12, 10]} />
              <meshPhysicalMaterial color={stoneColor} transmission={0.6} roughness={0.04} ior={2.2} clearcoat={1} />
            </mesh>
          );
        })}

      {/* Signet Ring: Wide flat golden bezel crest */}
      {type === "Signet" && (
        <group position={[0, 1.05, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.25, 0.65]} />
            <meshStandardMaterial {...metalProps} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 3D Necklace & Pendant Object
function NecklaceObject({ state }: { state: DesignState }) {
  const metalProps = getMetalMaterialProps(state, "purity");
  const pend = String(state.pendant || "Solitaire Drop");
  const stoneColor = stoneHex("necklace", state);
  const type = String(state.type || "Princess");

  return (
    <group position={[0, 0.35, 0]}>
      {/* Curved 3D Chain */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.3, 0.035, 24, 100, Math.PI * 1.15]} />
        <meshStandardMaterial {...metalProps} />
      </mesh>

      {/* Secondary layered strand for Rani Haar */}
      {type === "Rani Haar" && (
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[1.55, 0.04, 24, 100, Math.PI * 1.15]} />
          <meshStandardMaterial {...metalProps} />
        </mesh>
      )}

      {/* Mangalsutra black beads */}
      {type === "Mangalsutra" && (
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[1.31, 0.042, 16, 50, Math.PI * 1.15]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.1} />
        </mesh>
      )}

      {/* 3D Pendant Bail & Motif */}
      {pend !== "None" && (
        <group position={[0, -1.02, 0]}>
          {/* Hanging Bail Loop */}
          <mesh position={[0, 0.22, 0]}>
            <torusGeometry args={[0.08, 0.025, 12, 24]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>

          {pend === "Heart" ? (
            <mesh>
              <dodecahedronGeometry args={[0.38, 0]} />
              <meshPhysicalMaterial color={stoneColor} transmission={0.65} roughness={0.03} ior={2.2} clearcoat={1} />
            </mesh>
          ) : pend === "Lotus" ? (
            <group>
              {[-0.35, 0, 0.35].map((x, idx) => (
                <mesh key={idx} position={[x, 0, 0]} rotation={[0, 0, x]}>
                  <cylinderGeometry args={[0.08, 0.22, 0.5, 12]} />
                  <meshStandardMaterial {...metalProps} />
                </mesh>
              ))}
              <mesh position={[0, 0.05, 0.1]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshPhysicalMaterial color={stoneColor} transmission={0.6} roughness={0.02} clearcoat={1} />
              </mesh>
            </group>
          ) : pend === "Om" || pend === "Initial Disc" ? (
            <group>
              <mesh>
                <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
                <meshStandardMaterial {...metalProps} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0, 0.04]}>
                <ringGeometry args={[0.3, 0.34, 32]} />
                <meshStandardMaterial {...metalProps} roughness={0.05} />
              </mesh>
            </group>
          ) : (
            /* Solitaire Drop */
            <group>
              <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.18, 0.22, 8]} />
                <meshStandardMaterial {...metalProps} />
              </mesh>
              <FacetedGem shape="Pear" color={stoneColor} scale={1.2} position={[0, -0.1, 0]} />
            </group>
          )}
        </group>
      )}
    </group>
  );
}

// 3D Jhumka Earrings Object
function JhumkaObject({ state }: { state: DesignState }) {
  const metalProps = getMetalMaterialProps(state, "purity");
  const stoneColor = stoneHex("jhumka", state);
  const pearls = Number(state.pearls ?? 3);
  const domeK = { Small: 0.85, Medium: 1.0, Large: 1.18, Statement: 1.35 }[String(state.dome)] ?? 1.0;

  const Earring = ({ x }: { x: number }) => (
    <group position={[x, 0.3, 0]} scale={domeK}>
      {/* Stud Earring Top */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshPhysicalMaterial color={stoneColor} transmission={0.6} roughness={0.02} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.85, -0.05]}>
        <cylinderGeometry args={[0.24, 0.24, 0.06, 24]} />
        <meshStandardMaterial {...metalProps} />
      </mesh>

      {/* Connecting Chain link */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
        <meshStandardMaterial {...metalProps} />
      </mesh>

      {/* Bell / Dome */}
      <group position={[0, 0.15, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.62, 0.55, 32, 1, true]} />
          <meshStandardMaterial {...metalProps} side={THREE.DoubleSide} />
        </mesh>

        {/* Dome Rim Bead Ring */}
        <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.045, 16, 40]} />
          <meshStandardMaterial {...metalProps} />
        </mesh>

        {/* Hanging Natural Pearls */}
        {pearls > 0 &&
          Array.from({ length: pearls }).map((_, i) => {
            const angle = (i / Math.max(pearls, 1)) * Math.PI * 1.8 + 0.1;
            const px = Math.cos(angle) * 0.58;
            const pz = Math.sin(angle) * 0.58;
            return (
              <group key={i} position={[px, -0.32, pz]}>
                <mesh position={[0, -0.08, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.16, 6]} />
                  <meshStandardMaterial {...metalProps} />
                </mesh>
                <mesh position={[0, -0.22, 0]}>
                  <sphereGeometry args={[0.085, 16, 16]} />
                  <meshPhysicalMaterial color="#fefbf3" roughness={0.25} clearcoat={0.9} ior={1.65} />
                </mesh>
              </group>
            );
          })}
      </group>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      <Earring x={-0.85} />
      <Earring x={0.85} />
    </group>
  );
}

// 3D Bracelet Object
function BraceletObject({ state }: { state: DesignState }) {
  const metalProps = getMetalMaterialProps(state, "metal");
  const isTennis = state.chain === "Tennis";

  return (
    <group position={[0, 0.1, 0]} rotation={[0.4, 0, 0]}>
      {/* Main Oval Bangle / Chain */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 0.8, 1]}>
        <torusGeometry args={[1.1, isTennis ? 0.06 : 0.09, 24, 80]} />
        <meshStandardMaterial {...metalProps} />
      </mesh>

      {/* Tennis Diamonds */}
      {isTennis &&
        Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const x = Math.cos(a) * 1.32;
          const y = Math.sin(a) * 0.88;
          return (
            <mesh key={i} position={[x, y, 0]}>
              <sphereGeometry args={[0.065, 12, 10]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.7} roughness={0.03} clearcoat={1} ior={2.4} />
            </mesh>
          );
        })}

      {/* Dangling Charms */}
      {[-0.6, 0, 0.6].map((x, idx) => (
        <group key={idx} position={[x, -0.9, 0.2]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Velvet Display Stand Base with Soft Ambient Shadow
function VelvetStand() {
  return (
    <group position={[0, -1.35, 0]}>
      {/* Luxury Jewelry Pedestal */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.3, 48]} />
        <meshStandardMaterial color="#220710" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Gold Trim Ring around Stand */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.22, 0.03, 16, 48]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Master 3D Jewelry Component
export default function Jewelry3D({ kind = "ring", state }: { kind?: BuilderKind; state: DesignState }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControls | null>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.autoRotate = true;
      setAutoRotate(true);
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object;
      cam.position.multiplyScalar(delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative aspect-square w-full select-none overflow-hidden bg-gradient-to-b from-[#1f050b] via-[#2a0812] to-[#120206]">
      <Canvas
        camera={{ position: [0, 0.8, 4.4], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        shadows
      >
        <StudioEnvironment />
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 6, 5]} intensity={2.6} castShadow />
        <directionalLight position={[-4, 3, -3]} intensity={1.8} color="#ffe5bd" />
        <pointLight position={[0, 3, 3]} intensity={15} color="#ffffff" distance={8} />

        {/* Dynamic 3D Model based on Active Customizer Item */}
        {kind === "ring" && <RingObject state={state} />}
        {kind === "necklace" && <NecklaceObject state={state} />}
        {kind === "jhumka" && <JhumkaObject state={state} />}
        {kind === "bracelet" && <BraceletObject state={state} />}

        <VelvetStand />
        <Controls autoRotate={autoRotate} controlsRef={controlsRef} />
      </Canvas>

      {/* Floating 3D Interactive Toolset */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
        <div className="rounded-full bg-black/60 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-ivory/80 backdrop-blur-md">
          <span>Drag to rotate 360° • Pinch / scroll to zoom</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/70 p-1 backdrop-blur-md">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause auto-rotation" : "Start auto-rotation"}
            className={`rounded-full p-2 text-xs transition ${autoRotate ? "bg-gold text-burgundy-dark font-medium" : "text-ivory/80 hover:bg-white/10"}`}
          >
            <RotateCw size={14} className={autoRotate ? "animate-spin" : ""} style={{ animationDuration: "6s" }} />
          </button>
          <button
            onClick={() => handleZoom(0.88)}
            title="Zoom in"
            className="rounded-full p-2 text-ivory/80 hover:bg-white/10 transition"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => handleZoom(1.14)}
            title="Zoom out"
            className="rounded-full p-2 text-ivory/80 hover:bg-white/10 transition"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleReset}
            title="Reset perspective"
            className="rounded-full p-2 text-ivory/80 hover:bg-white/10 transition"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
