"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const SolarLandingPage = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Solar Images (Anil Kapoor Banner & UTL Company)
  const heroImages = [
    "/utl-hero-user-1.png",
    "/utl-hero-user-2.png",
    "/utl-hero-user-3-v2.png",
    "/utl-hero-user-4-v2.png",
    "/utl-hero-user-5-v2.png",
    "/utl-hero-user-6.png",
    "/utl-hero-user-7-v2.png",
    "/utl-hero-user-8.png",
    "/utl-hero-user-9-v2.png",
    "/utl-hero-user-10.png",
    "/utl-hero-user-11-v2.png",
    "https://www.upsinverter.com/wp-content/uploads/2025/11/UTL.jpg",
    "https://www.upsinverter.com/wp-content/uploads/2025/11/RD-1.jpg"
  ];

  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Slower transition for hero
    return () => clearInterval(interval);
  }, [heroImages.length]);


  // Solar Features - UTL Solar Product Categories
  const features = [
    {
      title: "Premium Solar Panels",
      description: "MonoPERC, Bifacial, and TOPCon technology solar panels. Available in 40W to 555W range with 25-year warranty and 22%+ efficiency.",
      icon: "☀️",
      image: "https://d3nut88kxhmnud.cloudfront.net/2024/07/Mono-PERC-Solar-Panel-540-Watt-24V-Bi-Facial-%E2%80%93-Pack-of-two-1.png"
    },
    {
      title: "Solar Inverters & PCU",
      description: "MPPT and PWM solar inverters from 1kVA to 10kVA. Gamma Plus, Sun Plus, Alfa+, and Sigma Pro series with advanced features.",
      icon: "⚡",
      image: "https://d3nut88kxhmnud.cloudfront.net/2023/12/GPP2kva-800x800.png"
    },
    {
      title: "Lithium & Tubular Batteries",
      description: "High-capacity inverter batteries and advanced lithium batteries. Built-in options available with wall-mountable designs.",
      icon: "�",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/04/sunlion-1000-main-800x800.png"
    },
    {
      title: "Complete Solar Systems",
      description: "On-grid, off-grid, and hybrid solar systems. Government subsidy eligible rooftop solutions from 1kW to 10kW.",
      icon: "🏠",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/03/hybridsolarmainimage.jpeg"
    }
  ];

  // Product Types - UTL Solar Actual Products
  const products = [
    {
      name: "Topcon Bifacial Solar Panel",
      description: "Next-gen bifacial technology for maximum power generation from both sides.",
      price: "₹16,500",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/12/topcon-bifacial-solar-panel.png",
      benefits: ["Bifacial Tech", "30% More Power", "30yr Warranty"],
      category: "Solar Panels"
    },
    {
      name: "Hybrid Solar Inverter System",
      description: "Complete hybrid solution with battery backup and grid connectivity.",
      price: "Request Quote",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/03/hybridsolarmainimage.jpeg",
      benefits: ["Hybrid Mode", "Grid Interactive", "Power Backup"],
      category: "Solar Systems"
    },
    {
      name: "Alfa+ Pro Solar PCU 5kVA",
      description: "5kVA/48V Solar Power Conditioning Unit. Advanced hybrid solar inverter.",
      price: "₹52,000",
      image: "https://www.upsinverter.com/wp-content/uploads/2024/07/ALFA-PRO-SOLAR-PCU-1-1970x1478.png",
      benefits: ["Hybrid Mode", "MPPT Charge", "Grid Interactive"],
      category: "Inverters"
    },
    {
      name: "UTL Solar Battery Combo",
      description: "Perfectly matched solar battery and inverter combo for long backup.",
      price: "₹28,500",
      image: "https://www.upsinverter.com/wp-content/uploads/2020/09/solar-pcu31-min.jpg",
      benefits: ["Long Life", "Quick Charge", "Low Maintenance"],
      category: "Batteries"
    },
    {
      name: "Gamma Plus 2600 MPPT Inverter",
      description: "2kVA/24V r-MPPT Solar Inverter with LCD Display. Advanced solar charging.",
      price: "₹18,999",
      image: "https://d3nut88kxhmnud.cloudfront.net/2023/12/GPP2kva-800x800.png",
      benefits: ["r-MPPT Tech", "LCD Display", "Overload Protection"],
      category: "Inverters"
    },
    {
      name: "Gamma Plus LiON 1000",
      description: "1000VA inverter with built-in 100Ah Lithium battery. Wall mountable.",
      price: "₹45,000",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/04/sunlion-1000-main-800x800.png",
      benefits: ["Built-in Battery", "Wall Mount", "10yr Warranty"],
      category: "Batteries"
    },
    {
      name: "Sun Plus 1060 PWM Inverter",
      description: "875VA/12V PWM Solar Home Inverter. Reliable and efficient power backup.",
      price: "₹6,499",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/05/sunplus-1060-800x800.png",
      benefits: ["PWM Technology", "Compact Size", "Low Maintenance"],
      category: "Inverters"
    },
    {
      name: "Solar Panel - MonoPERC 540W",
      description: "High-efficiency MonoPERC solar panel. Available in 40W to 555W range.",
      price: "₹14,500",
      image: "https://d3nut88kxhmnud.cloudfront.net/2024/07/Mono-PERC-Solar-Panel-540-Watt-24V-Bi-Facial-%E2%80%93-Pack-of-two-1.png",
      benefits: ["22% Efficiency", "Bifacial Tech", "25yr Warranty"],
      category: "Solar Panels"
    },
    {
      name: "UTL Solar Management Unit (SMU)",
      description: "Converts your existing normal inverter into a solar inverter. 12V/24V options.",
      price: "₹1,850",
      image: "https://d3nut88kxhmnud.cloudfront.net/2023/12/GPP2kva-800x800.png",
      benefits: ["Retrofit Solution", "Solar Priority", "Money Saving"],
      category: "Accessories"
    },
    {
      name: "UTL Heliac Solar Inverter",
      description: "PWM Solar Inverter for home. Multi-color LCD Display with IT mode.",
      price: "₹5,500",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/05/sunplus-1060-800x800.png",
      benefits: ["User Friendly", "IT Load Support", "Inbuilt PWM"],
      category: "Inverters"
    },
    {
      name: "UTL Sigma Pro Solar PCU",
      description: "Grid Interactive Solar PCU 2kVA-15kVA. rMPPT Based technology.",
      price: "₹42,000",
      image: "https://www.upsinverter.com/wp-content/uploads/2024/07/ALFA-PRO-SOLAR-PCU-1-1970x1478.png",
      benefits: ["Grid Export", "IoT Enabled", "5yr Warranty"],
      category: "Inverters"
    },
    {
      name: "UTL F3 On-Grid Inverter",
      description: "Transformerless Graphic Display String Inverter. High efficiency.",
      price: "₹35,000",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/03/hybridsolarmainimage.jpeg",
      benefits: ["98% Efficiency", "WiFi Monitoring", "IP65 Rated"],
      category: "Inverters"
    },
    {
      name: "UTL Solar DC Fan 12V",
      description: "High speed 12V DC Solar Fan. Works directly on battery/solar.",
      price: "₹1,200",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/05/sunplus-1060-800x800.png",
      benefits: ["Energy Saving", "High Speed", "Low Power"],
      category: "Appliances"
    },
    {
      name: "UTL PWM Charge Controller",
      description: "12V/24V 10A-20A Solar Charge Controller. Protects battery life.",
      price: "₹850",
      image: "https://d3nut88kxhmnud.cloudfront.net/2023/12/GPP2kva-800x800.png",
      benefits: ["Battery Safety", "USB Charging", "LED Indicator"],
      category: "Accessories"
    },
    {
      name: "UTL rMPPT Charge Controller",
      description: "Advanced rMPPT technology for 30% more efficiency. 12V/24V/48V.",
      price: "₹4,500",
      image: "https://www.upsinverter.com/wp-content/uploads/2024/07/ALFA-PRO-SOLAR-PCU-1-1970x1478.png",
      benefits: ["Max Efficiency", "LCD Display", "Multi-stage Charging"],
      category: "Accessories"
    },
    {
      name: "UTL E-Rickshaw Charger",
      description: "Fast charging SMPS based E-Rickshaw Battery Charger. 48V/15A.",
      price: "₹3,200",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/05/sunplus-1060-800x800.png",
      benefits: ["Fast Charging", "Cut-off Protection", "Compact Design"],
      category: "EV Chargers"
    },
    {
      name: "UTL E-Rickshaw Li-Ion Battery",
      description: "Long life Lithium-Ion Battery for E-Rickshaw. 48V/80Ah.",
      price: "₹45,000",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/04/sunlion-1000-main-800x800.png",
      benefits: ["3yr Warranty", "Maintenance Free", "Fast Charging"],
      category: "Batteries"
    },
    {
      name: "UTL Mars Online Solar PCU",
      description: "Double Conversion Online Solar PCU for critical loads. 5kVA-10kVA.",
      price: "₹85,000",
      image: "https://www.upsinverter.com/wp-content/uploads/2024/07/ALFA-PRO-SOLAR-PCU-1-1970x1478.png",
      benefits: ["Zero Transfer", "Pure Sine Wave", "Critical Load"],
      category: "Online UPS"
    },
    {
      name: "UTL Star Online Solar PCU",
      description: "Three Phase Online Solar PCU for Industrial use. 10kVA-120kVA.",
      price: "₹2,50,000",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/03/hybridsolarmainimage.jpeg",
      benefits: ["Industrial Grade", "Load Sharing", "Remote Monitoring"],
      category: "Online UPS"
    },
    {
      name: "UTL 3kW Off-Grid System",
      description: "Complete 3kW Off-Grid Solar System with Gamma+ Inverter.",
      price: "₹1,80,000",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/03/hybridsolarmainimage.jpeg",
      benefits: ["Power Freedom", "Day/Night Backup", "Easy Install"],
      category: "Solar Systems"
    },
    {
      name: "UTL 5kW Hybrid System",
      description: "Advanced 5kW Hybrid System with Lithium Battery backup.",
      price: "₹3,50,000",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/03/hybridsolarmainimage.jpeg",
      benefits: ["Grid Independence", "Smart Control", "Long Life"],
      category: "Solar Systems"
    },
    {
      name: "UTL Sun Plus 2500 Inverter",
      description: "2kVA/24V Modified Sine Wave Solar Inverter for homes.",
      price: "₹9,500",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/05/sunplus-1060-800x800.png",
      benefits: ["Heavy Load", "Budget Friendly", "Solar Capable"],
      category: "Inverters"
    },
    {
      name: "UTL Gas Geyser",
      description: "Instant Gas Water Heater. Safety features included.",
      price: "₹4,200",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/04/sunlion-1000-main-800x800.png", // Using battery image as proxy for tank
      benefits: ["Instant Hot Water", "Battery Operated", "Safe"],
      category: "Appliances"
    },
    {
      name: "UTL LED Solar Street Light",
      description: "All-in-One Solar Street Light with Motion Sensor. 12W-60W.",
      price: "₹2,800",
      image: "https://d3nut88kxhmnud.cloudfront.net/2025/12/topcon-bifacial-solar-panel.png", // Using panel image as proxy
      benefits: ["Auto On/Off", "Motion Sensor", "Waterproof"],
      category: "Lighting"
    }
  ];

  // Stats
  const stats = [
    { number: "25+ Years", label: "Industry Experience", icon: "⚡" },
    { number: "10,000+", label: "Happy Customers", icon: "🏠" },
    { number: "Pan-India", label: "Service Network", icon: "�" },
    { number: "ISO Certified", label: "Quality Assured", icon: "⭐" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Fujiyama transformed our electricity bill. We went from ₹8000 to almost zero! The AI monitoring is a game changer.",
      author: "Amit Patel",
      role: "Homeowner, Gujarat",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
    },
    {
      quote: "Excellent installation team. Very professional and clean work. The panels look premium on my roof.",
      author: "Sneha Reddy",
      role: "Architect, Hyderabad",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
    },
    {
      quote: "ROI is better than expected. Customer support guided me through the subsidy process smoothly.",
      author: "Vikram Singh",
      role: "Business Owner, Delhi",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&h=200&fit=crop"
    }
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    [heroRef, featuresRef, productsRef, statsRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Chatbot Integration
  useEffect(() => {
    // Set API URL in window for chatbot bundle to access
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Use URL from .env.local
    if (apiUrl) {
      (window as any).NEXT_PUBLIC_API_URL = apiUrl;
      // Also set FUJIYAMA_CONFIG for compatibility
      if (!(window as any).FUJIYAMA_CONFIG) {
        (window as any).FUJIYAMA_CONFIG = {};
      }
      (window as any).FUJIYAMA_CONFIG.API_BASE_URL = apiUrl;
    }

    // Checks if script is already loaded to avoid duplicates
    const existingScript = document.querySelector('script[src="/chatbot-new.bundle.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '/chatbot-new.bundle.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [pathname]);

  return (
    <>


      <div className={`min-h-screen relative overflow-x-hidden w-full transition-colors duration-500 font-['Inter'] ${isDarkMode ? 'dark' : ''}`}>

        {/* Modern Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-gray-900 dark:to-emerald-950 -z-10"></div>

        {/* Floating Decorative Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl animate-float -z-10"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-green-400/10 dark:bg-green-600/10 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '3s' }}></div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="fixed top-24 right-6 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg hover:scale-105 transition-transform"
        >
          {isDarkMode ? '🌙' : '🌙'}
        </button>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/utl-logo.png"
                  alt="UTL Solar Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col shrink-0">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600">UTL Solar</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 hidden md:block">A Brand of Fujiyama Power Systems</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Link href="#products" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Products</Link>
              <Link href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Solutions</Link>
              <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full hover:shadow-lg hover:opacity-90 transition transform hover:-translate-y-0.5">
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-200">
              <Link
                href="#products"
                className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-between group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="#features"
                className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-between group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Solutions <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <Link
                href="/login"
                className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="relative z-10 min-h-screen flex items-center pt-20 px-6">
          {/* ... existing hero content ... */}
          {/* (keeping hero content same, just ensuring context for replacement if needed, but since I am targeting lines, I will focus on the new sections insertion point) */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-5 space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800">
                🚀 AI-Powered Solar Technology
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
                India's Trusted
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500">Solar Solutions Provider</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Complete range of solar panels, inverters, batteries, and solar systems. On-grid, off-grid, and hybrid solutions at best prices with EMI options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#products" className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                  Explore Products
                </Link>
                <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:shadow-lg hover:border-blue-500 transition-all">
                  Get a Quote
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200">
                      <img src={`https://randomuser.me/api/portraits/thumb/men/${i + 10}.jpg`} alt="User" className="w-full h-full rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">2000+</span> Happy Families
                </div>
              </div>
            </div>

            {/* Hero Image / Visual */}
            <div className={`lg:col-span-7 relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full h-[450px] md:h-[650px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-900">
                <Image
                  src={heroImages[heroImageIndex]}
                  alt="Solar Hero"
                  fill
                  className="object-fill scale-y-[0.87]"
                />


              </div>

              {/* Decorative Elements */}

            </div>
          </div>
        </section>

        {/* Trust Indicators Banner */}
        <section className="py-12 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 border-y border-orange-100 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: "🚚", title: "Free Shipping", desc: "All Over India" },
                { icon: "💳", title: "EMI Available", desc: "Easy Payment Options" },
                { icon: "🛡️", title: "24/7 Support", desc: "Technical Assistance" },
                { icon: "✅", title: "Secure Payment", desc: "All Cards Accepted" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo Cloud / Stats */}
        <section ref={statsRef} className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-y border-gray-100 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group cursor-default">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-2">{stat.number}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - New Section */}
        <section className="py-32 px-6 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Switch to Solar in <span className="text-green-600">3 Simple Steps</span></h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We handle everything from permits to installation.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 dark:from-gray-700 dark:to-gray-700 z-0"></div>

              {[
                { step: 1, title: "Book Consultation", desc: "Schedule a free site visit. Our engineers will analyze your roof.", icon: "📅" },
                { step: 2, title: "Custom Design", desc: "Get a tailored AI-generated solar plan & savings report.", icon: "📐" },
                { step: 3, title: "Installation", desc: "1-day hassle-free installation by certified Fujiyama pros.", icon: "⚡" }
              ].map((item, i) => (
                <div key={i} className="relative z-10 text-center group">
                  <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-900 border-4 border-blue-50 dark:border-gray-800 rounded-full flex items-center justify-center text-4xl shadow-xl mb-6 group-hover:scale-110 group-hover:border-green-400 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section ref={featuresRef} id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Why Choose <span className="text-orange-600">UTL Solar</span>?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We combine world-class hardware with cutting-edge AI software to give you the most efficient solar experience.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                      <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-2xl shadow-lg z-10">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="p-8 md:w-3/5 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                      <div className="mt-6 flex items-center text-green-600 font-semibold cursor-pointer">
                        Learn more <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Excellence Section */}
        <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">World-Class Infrastructure</Badge>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">State-of-the-Art <span className="text-orange-600">Manufacturing</span></h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                With 4 advanced manufacturing units and 25+ years of R&D excellence, we craft the future of energy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative group overflow-hidden rounded-3xl shadow-lg cursor-pointer">
                <img
                  src="https://www.upsinverter.com/wp-content/uploads/2025/11/UTL.jpg"
                  alt="UTL Solar Manufacturing Plant"
                  className="w-full h-[400px] object-fill transition-transform duration-700"
                />
              </div>

              <div className="relative group overflow-hidden rounded-3xl shadow-lg cursor-pointer">
                <img
                  src="https://www.upsinverter.com/wp-content/uploads/2025/11/RD-1.jpg"
                  alt="UTL Solar R&D Lab"
                  className="w-full h-[400px] object-fill transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Showcase */}
        <section ref={productsRef} id="products" className="py-32 px-6 bg-gray-900 text-white relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-green-600/20 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <div className="text-green-400 font-bold mb-2 tracking-wider">PREMIUM COLLECTION</div>
                <h2 className="text-4xl md:text-5xl font-bold">Solar Ecosystem</h2>
              </div>
              <Link href="#" className="hidden md:inline-block border-b border-white pb-1 hover:text-green-400 hover:border-green-400 transition">View Full Catalog</Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <div key={idx} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-3xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative bg-white/5 shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 transition-transform duration-700" />
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold">
                      {product.price}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 h-14 line-clamp-2 flex items-center">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                    <ul className="space-y-2 mb-6">
                      {product.benefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> {b}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full mt-auto py-3 rounded-xl bg-white text-black font-bold hover:bg-green-400 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / Footer */}
        <section className="py-24 px-6 bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
          <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to switch to solar?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto relative z-10">Get a free consultation and customized solar design for your roof today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="px-10 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                Call an Expert
              </button>
              <button className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition">
                Calculate Savings
              </button>
            </div>
          </div>
        </section>

        {/* Premium Footer */}
        <footer className="relative z-10 py-16 px-8 bg-gray-900 text-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600"></div>
          <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[100%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

              {/* Brand Column */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    ⚡
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                      UTL Solar
                    </span>
                    <span className="text-xs text-gray-500 -mt-1">A Brand of Fujiyama Power Systems</span>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  India's leading manufacturer of solar panels, inverters, batteries, and complete solar systems. Trusted by 10,000+ customers across India.
                </p>
                <div className="flex space-x-4 pt-2">
                  {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                    <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300">
                      <span className="capitalize">{social[0]}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Company Column (New) */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Company</h4>
                <ul className="space-y-4 text-gray-400">
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>About Us</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Certificates</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Careers</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Banking Details</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Contact Us</a></li>
                </ul>
              </div>

              {/* Products Column */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Products</h4>
                <ul className="space-y-4 text-gray-400">
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Bifacial Panels</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Hybrid Inverters</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Solar Batteries</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Street Lights</a></li>
                  <li><a href="#" className="hover:text-green-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Solar Pumps</a></li>
                </ul>
              </div>

              {/* Solutions Column */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Solutions</h4>
                <ul className="space-y-4 text-gray-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Residential Rooftop</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Commercial Solar</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Utility Scale/Ground</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Solar Microgrids</a></li>
                </ul>
              </div>

              {/* Support Column */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-800 pb-2 inline-block">Support</h4>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-start"><span className="mr-3 mt-1 text-orange-500">📞</span> +91 1800-SOLAR-00</li>
                  <li className="flex items-start"><span className="mr-3 mt-1 text-orange-500">📧</span> service@utlups.com</li>
                  <li className="flex items-start"><span className="mr-3 mt-1 text-orange-500">📧</span> sales@utlups.com</li>
                  <li className="flex items-start"><span className="mr-3 mt-1 text-orange-500">📍</span> India - Pan India Service</li>
                  <li className="pt-4">
                    <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm transition-colors">
                      Track Order
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <p>&copy; 2025 UTL Solar - A Brand of Fujiyama Power Systems Limited. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Returns Policy</a>
                <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Chat Trigger (Fallback visually if script fails) */}
        {/* <div className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform z-50">
            <span className="text-3xl">💬</span>
        </div> */}

      </div>
    </>
  );
};

export default SolarLandingPage;
