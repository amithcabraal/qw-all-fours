import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import GameBoard from './components/GameBoard';
import UI from './components/UI';
import { useState, useEffect } from 'react';

function App() {
  const [bgColor, setBgColor] = useState('#f1f5f9'); // Start with light mode color

  useEffect(() => {
    const darkModeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('dark')) {
          setBgColor('#0f172a');
        } else {
          setBgColor('#f1f5f9');
        }
      });
    });

    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => darkModeObserver.disconnect();
  }, []);

  return (
    <div className="w-full h-screen bg-slate-100 dark:bg-slate-900 relative">
      <UI />
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        className="w-full h-full"
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 8, 20]} />
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.5}
        />
        <GameBoard />
        <OrbitControls
          minDistance={5}
          maxDistance={15}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
        />
        <Preload all />
      </Canvas>
    </div>
  );
}

export default App;