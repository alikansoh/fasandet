"use client";

import React, { useRef, useState, FC, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Award, Users } from "lucide-react";
import * as THREE from "three";

// ===== FireAlarmButton Props =====
interface FireAlarmButtonProps {
  hover: boolean;
  scale: number;
}

const FireAlarmButton: FC<FireAlarmButtonProps> = ({ hover, scale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/fire_alarm_button.glb");

  // Recenter and optimize the model
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Calculate bounding box and center the model
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    groupRef.current.position.sub(center);
    
    // Set initial scale
    groupRef.current.scale.setScalar(scale);
    
    // Optimize model - reduce unnecessary geometry complexity if needed
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene, scale]);

  const rotationSpeed = 0.01;
  const floatAmplitude = 0.1;
  const floatSpeed = 2;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Floating
    groupRef.current.position.y = Math.sin(t * floatSpeed) * floatAmplitude;

    // Rotation Y
    groupRef.current.rotation.y += rotationSpeed;

    // Hover rotation X
    const targetXRot = hover ? Math.sin(t * 3) * 0.15 : 0;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetXRot,
      0.1
    );

    // Hover scale - dramatic scaling
    const targetScale = hover ? scale * 1.5 : scale;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    );
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

// ===== Feature Type =====
interface Feature {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
}

// ===== Main About Component =====
const About: FC = () => {
  const [hover, setHover] = useState(false);
  const [modelScale, setModelScale] = useState(16);

  // Enhanced responsive scale calculation
  const getResponsiveScale = () => {
    const width = window.innerWidth;
    if (width < 480) return 18; // Bigger on small phones
    if (width < 768) return 20; // Bigger on tablets
    if (width < 1024) return 19; // laptops
    return 16; // large screens
  };

  useEffect(() => {
    setModelScale(getResponsiveScale());
    const handleResize = () => setModelScale(getResponsiveScale());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features: Feature[] = [
    {
      title: "Certified Experts",
      description:
        "Our team is fully accredited, bringing years of technical knowledge and hands-on expertise.",
      icon: ShieldCheck,
    },
    {
      title: "Cutting-Edge Solutions",
      description:
        "We use the latest technology to ensure safety, reliability, and efficiency in every project.",
      icon: Zap,
    },
    {
      title: "Trusted by Clients",
      description:
        "Hundreds of businesses and homeowners trust us for reliable fire alarm and electrical services.",
      icon: Users,
    },
    {
      title: "Award-Winning Service",
      description:
        "Recognised for excellence in safety, customer satisfaction, and innovative solutions.",
      icon: Award,
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Reduced padding significantly on mobile */}
      <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-2 sm:py-6 lg:py-8 relative z-10">
        {/* Section Header - Reduced margins */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-2 sm:mb-6"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4">
            About <span className="text-red-500">Us</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto px-2">
            With over{" "}
            <span className="font-semibold text-white">25 years</span> of
            experience, we deliver safe, reliable, and professional fire alarm &
            electrical solutions tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 items-center">
          {/* ===== Left - 3D Fire Alarm Button Canvas (Optimized) ===== */}
          <motion.div
            className="w-full h-[350px] sm:h-[450px] md:h-[600px] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl touch-pan-y"
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            style={{
              // Ensure no extra margins around the canvas
              margin: 0,
              padding: 0,
            }}
          >
            <Canvas 
              camera={{ position: [0, 0.5, 1.6], fov: 85 }}
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'block',
                margin: 0,
                padding: 0
              }}
              gl={{ 
                antialias: false, // Disable for better mobile performance
                alpha: true,
                powerPreference: "high-performance"
              }}
              dpr={[1, 2]} // Limit pixel ratio for better performance
            >
              {/* Optimized Lighting */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={0.8} />
              <pointLight position={[-3, 3, 3]} intensity={0.4} color="red" />
              <pointLight position={[3, 3, 3]} intensity={0.4} color="blue" />

              {/* Tightly centered 3D model */}
              <Center position={[0, 0, 0]} precise>
                <FireAlarmButton hover={hover} scale={modelScale} />
              </Center>

              {/* Hover sparks */}
              {hover && (
                <mesh position={[0, 0.5, 0]}>
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshBasicMaterial color="#ff0000" />
                </mesh>
              )}

              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.8}
                autoRotate={false}
                maxPolarAngle={Math.PI}
                minPolarAngle={0}
              />
            </Canvas>
          </motion.div>

          {/* ===== Right - Features (Optimized spacing) ===== */}
          <div className="grid gap-2 sm:gap-4 px-2 sm:px-0">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 35px -12px rgba(239,68,68,0.25)",
                  }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg relative overflow-hidden"
                >
                  <div className="flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* ===== Call-to-Action Button ===== */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="mt-2 sm:mt-4"
            >
              <a
                href="#contact"
                className="inline-block w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 bg-red-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300 hover:shadow-xl"
              >
                Get a Free Consultation
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;