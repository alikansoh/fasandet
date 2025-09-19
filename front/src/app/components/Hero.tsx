"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FireExtinguisher, Zap, Users, Headphones } from "lucide-react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { number: 25, label: "Years Experience", icon: FireExtinguisher, animation: "animate-wiggle" },
    { number: 1000, label: "Systems Installed", icon: Zap, animation: "animate-flash" },
    { number: 500, label: "Happy Clients", icon: Users, animation: "animate-bounce-slow" },
    { number: 24, label: "7 Support Availability", icon: Headphones, animation: "animate-pulse" },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });

  return (
    <section
      id="home"
      className="relative w-full flex flex-col justify-center items-center text-center overflow-hidden pt-24 sm:pt-28 md:pt-36 lg:pt-40 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover scale-105"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-poster.png"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        <source src="/hero-video.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40"></div>

      {/* Hero Content */}
      <div
        className={`relative z-10 max-w-5xl mx-auto mt-5 pb-4 text-white transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 drop-shadow-lg">
          Fire Alarm & Electrical{" "}
          <span className="block text-red-600">Services</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl mb-10 font-light leading-relaxed max-w-2xl mx-auto text-white/85">
          Over{" "}
          <span className="text-white font-semibold">25 years</span> of
          experience delivering professional fire alarm and electrical solutions
          with unmatched reliability and safety.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-red-700/50 overflow-hidden"
          >
            <span className="relative">Get Free Quote</span>
            <svg
              className="relative w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          <a
            href="#services"
            className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-semibold py-3 px-8 rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:bg-white/10"
          >
            Our Services
          </a>
        </div>

        {/* Stats Section */}
        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto mt-8 sm:mt-12 md:mt-16 mb-16 sm:mb-20 md:mb-24"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-1 shadow-lg"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <Icon
                  className={`w-10 h-10 mb-3 text-red-500 drop-shadow-lg ${stat.animation}`}
                />

                {/* Number */}
                <div className="text-3xl sm:text-4xl font-black mb-1 text-white drop-shadow">
                  {inView ? (
                    stat.label.includes("Support") ? (
                      <span className="flex items-center gap-1">
                        <span className="text-red-500 animate-pulse">
                          <CountUp end={stat.number} duration={2.5} />
                        </span>
                        <span className="text-white">/7</span>
                      </span>
                    ) : (
                      <CountUp
                        end={stat.number}
                        duration={3}
                        suffix={stat.number >= 500 ? "+" : ""}
                      />
                    )
                  ) : (
                    0
                  )}
                </div>

                {/* Label */}
                <p className="text-sm sm:text-base font-medium text-white/80 text-center">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-0 md:bottom-10 lg:bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/70 text-xs sm:text-sm font-medium">
            Scroll Down
          </span>
          <div className="w-7 h-12 border-2 border-white/40 rounded-full flex justify-center items-start animate-bounce hover:border-white/80 transition-colors cursor-pointer">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

