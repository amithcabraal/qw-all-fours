import { useGameStore } from '../store/gameStore';
import { DoubleSide } from 'three';

export default function Grid() {
  const placeToken = useGameStore((state) => state.placeToken);

  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Grid poles - 4x4 grid */}
      {Array.from({ length: 4 }).map((_, x) =>
        Array.from({ length: 4 }).map((_, z) => {
          // Calculate grid positions to center the 4x4 grid
          const posX = (x - 1.5) * 1.2;
          const posZ = (z - 1.5) * 1.2;
          
          return (
            <group key={`grid-${x}-${z}`} position={[posX, 0, posZ]}>
              {/* Vertical pole */}
              <mesh castShadow receiveShadow position={[0, 2, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 4, 16]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.6}
                  roughness={0.2}
                />
              </mesh>
              {/* Clickable area */}
              <mesh
                position={[0, 2, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  placeToken(x, z);
                }}
              >
                <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
                <meshStandardMaterial
                  transparent
                  opacity={0}
                  side={DoubleSide}
                />
              </mesh>
            </group>
          );
        })
      )}
    </group>
  );
}