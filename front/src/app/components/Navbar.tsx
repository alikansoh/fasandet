"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const lastScroll = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  // Active link detection (IntersectionObserver)
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(`#${entry.target.id}`);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Hide navbar on scroll down, show on scroll up + set scrolled state
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // set scrolled (used to add background)
      setScrolled(currentScroll > 50); // change threshold as you like

      // hide/show navbar when not in mobile menu
      if (!mobileMenuOpen) {
        if (currentScroll > lastScroll.current && currentScroll > 100) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original || "";
    }
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"} transition-colors`}
        aria-hidden={hidden}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
          }`}
        >
          <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="FireSafe Pro Logo"
                width={150}
                height={70}
                // filter + brightness utilities: darker by default, slightly darker when scrolled
                className={`w-50 sm:w-30 md:w-65 transition-all duration-300 filter ${
                  scrolled ? "brightness-110" : "brightness-110"
                }`}
                priority
              />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-6 lg:space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium transition-colors duration-200 text-white ${
                    activeLink === link.href
                      ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-red-500"
                      : "hover:text-gray-300"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 focus:outline-none rounded-full hover:bg-white/20 transition"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center transition-transform duration-300 ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/20 text-white z-50 transition"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Menu Links */}
        <div className="flex flex-col space-y-10">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-3xl sm:text-4xl font-semibold transition-all duration-500 transform ${
                mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
              } ${
                activeLink === link.href ? "text-red-500 underline underline-offset-4" : "text-white hover:text-gray-300"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
