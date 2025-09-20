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

  // Recenter the model once loaded
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    groupRef.current.position.sub(center);
    
    // Set initial scale
    groupRef.current.scale.setScalar(scale);
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

    // Hover scale - much more dramatic scaling
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

  // Function to calculate responsive scale - made slightly bigger
  const getResponsiveScale = () => {
    const width = window.innerWidth;
    if (width < 480) return 14; // small phones
    if (width < 768) return 17; // tablets
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            About <span className="text-red-500">Us</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            With over{" "}
            <span className="font-semibold text-white">25 years</span> of
            experience, we deliver safe, reliable, and professional fire alarm &
            electrical solutions tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
          {/* ===== Left - 3D Fire Alarm Button Canvas ===== */}
          <motion.div
            className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl touch-pan-y"
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
          >
            <Canvas camera={{ position: [0, 0.5, 1.8], fov: 80 }}>
              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 10, 5]} intensity={1} />
              <pointLight position={[-5, 5, 5]} intensity={0.5} color="red" />
              <pointLight position={[5, 5, 5]} intensity={0.5} color="blue" />

              {/* Centered 3D model */}
              <Center>
                <FireAlarmButton hover={hover} scale={modelScale} />
              </Center>

              {/* Hover sparks - made larger */}
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
              />
            </Canvas>
          </motion.div>

          {/* ===== Right - Features ===== */}
                      <div className="grid gap-3 sm:gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(239,68,68,0.25)",
                  }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg relative overflow-hidden"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* ===== Call-to-Action Button ===== */}
            <motion.div whileHover={{ scale: 1.05 }} className="mt-3 sm:mt-4">
              <a
                href="#contact"
                className="inline-block px-8 py-4 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:bg-red-600 transition"
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