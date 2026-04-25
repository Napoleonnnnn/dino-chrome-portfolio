import { Scene3D } from './Scene3D';
import { DinoModel } from './DinoModel';
import { BirdModel } from './BirdModel';
import { CloudsModel } from './CloudsModel';
import { CactusModel } from './CactusModel';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useIsMobile } from '@/hooks/use-mobile';

export function FloatingAssets() {
  const themeColor = useThemeColor();
  const isMobile = useIsMobile();

  // Don't render any 3D assets on mobile — too heavy for GPU/battery
  if (isMobile) return null;

  return (
    <>
      {/* Large Dino - top right area */}
      <div className="floating-element top-[12%] right-[5%] w-72 h-72 animate-float opacity-40">
        <Scene3D cameraPosition={[0, 1, 4]} floatIntensity={0.5}>
          <DinoModel position={[0, 0, 0]} scale={0.8} color={themeColor} animate={false} />
        </Scene3D>
      </div>

      {/* Bird - left upper */}
      <div className="floating-element top-[20%] left-[3%] w-64 h-64 animate-float-slow opacity-35">
        <Scene3D cameraPosition={[0, 0, 3]} floatIntensity={0.8}>
          <BirdModel position={[0, 0, 0]} scale={0.5} speed={0.3} color={themeColor} />
        </Scene3D>
      </div>

      {/* Another Bird - right middle */}
      <div className="floating-element top-[55%] right-[8%] w-56 h-56 animate-drift opacity-30">
        <Scene3D cameraPosition={[0, 0, 3]} floatIntensity={0.6}>
          <BirdModel position={[0, 0, 0]} scale={0.4} speed={0.5} color={themeColor} />
        </Scene3D>
      </div>

      {/* Clouds - top left */}
      <div className="floating-element top-[35%] left-[10%] w-80 h-56 animate-float-reverse opacity-25">
        <Scene3D cameraPosition={[0, 0, 6]} floatIntensity={0.3}>
          <CloudsModel position={[0, 0, 0]} scale={0.006} speed={0.2} color={themeColor} />
        </Scene3D>
      </div>

      {/* Cactus - bottom left */}
      <div className="floating-element bottom-[10%] left-[5%] w-64 h-72 animate-float opacity-40">
        <Scene3D cameraPosition={[0, 1, 3]} floatIntensity={0.4}>
          <CactusModel position={[0, -0.5, 0]} scale={1} color={themeColor} />
        </Scene3D>
      </div>

      {/* Dino - bottom center-right */}
      <div className="floating-element bottom-[25%] right-[20%] w-48 h-48 animate-float-slow opacity-30">
        <Scene3D cameraPosition={[0, 1, 5]} floatIntensity={0.7}>
          <DinoModel position={[0, 0, 0]} scale={0.5} color={themeColor} animate={false} />
        </Scene3D>
      </div>

      {/* Additional Clouds - right side */}
      <div className="floating-element top-[70%] left-[60%] w-72 h-48 animate-drift opacity-20">
        <Scene3D cameraPosition={[0, 0, 6]} floatIntensity={0.5}>
          <CloudsModel position={[0, 0, 0]} scale={0.005} speed={0.15} color={themeColor} />
        </Scene3D>
      </div>
    </>
  );
}
