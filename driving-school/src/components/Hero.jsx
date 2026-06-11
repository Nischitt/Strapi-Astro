import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  const galleryImages = [
    "src/images/g1.jpg", "src/images/g2.jpg", "src/images/g3.jpg",
    "src/images/g4.jpg", "src/images/g5.jpg", "src/images/g6.jpg",
    "src/images/g7.jpg", "src/images/g8.jpg", "src/images/g9.jpg"
  ];

  return (
    <div className="w-full min-h-screen font-sans bg-white text-slate-700 antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-black">
      
      {/* 1. HERO BANNER SECTION */}
      <section id="home" className="h-screen relative flex items-center justify-start overflow-hidden">
        <img
          src="src/images/18.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          alt="uDrive Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white w-full">
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs bg-yellow-500/10 px-3 py-1.5 border border-yellow-500/20 rounded-full inline-block mb-4">
            Welcome to uDrive School
          </span>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold max-w-3xl tracking-tight leading-none"
          >
            Learn Driving With <span className="text-yellow-500">Confidence</span>
          </motion.h1>

          <p className="mt-6 text-lg md:text-xl max-w-xl text-neutral-300 font-light leading-relaxed">
            Professional certified instructors and modern dual-controlled training vehicles tailored for your safety.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/Contact"><button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-8 py-4 font-bold tracking-wide uppercase text-xs transition duration-300 shadow-lg shadow-yellow-500/20">
              Get Started Now
            </button></a>
            <a href="/Modern"><button className="border-2 border-white hover:bg-white hover:text-slate-950 text-white px-8 py-4 font-bold tracking-wide uppercase text-xs transition duration-300">
              Our Courses
            </button></a>
          </div>
        </div>
      </section>

      {/* 2. DUAL IMAGE PIONEER SECTION */}
      <section className="py-24 bg-white text-slate-900 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Block: Split overlapping images layout */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
            <div className="col-span-7 h-[380px] overflow-hidden rounded-sm shadow-md">
              <img src="src/images/21.jpg" className="w-full h-full object-cover" alt="Latest Fleet Vehicle" />
            </div>
            <div className="col-span-5 h-[280px] self-end overflow-hidden rounded-sm shadow-lg border-4 border-white transform translate-y-8 -translate-x-4">
              <img src="src/images/Driving.jpg" className="w-full h-full object-cover" alt="Instructor Profile" />
            </div>
            
            {/* Experience Year badge box counter */}
            <div className="absolute -bottom-6 left-6 bg-slate-950 text-white px-6 py-5 shadow-xl flex items-center gap-4 border-l-4 border-yellow-500">
              <span className="text-4xl font-black text-yellow-500 tracking-tight">15+</span>
              <div className="text-xs font-bold uppercase tracking-wider leading-tight text-neutral-300">
                Years of <br /> Excellence
              </div>
            </div>
          </div>

          {/* Right Block: Content Details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-yellow-600 font-bold uppercase tracking-wider text-xs mb-2 block">About Our Academy</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight mb-6">
              A perfect driving school with latest training vehicles
            </h2>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              We provide comprehensive training environments with adaptive courses designed to build long-term confidence on all types of road routes. Our systems conform completely to current standard highway safe-practices.
            </p>

            {/* Checkpoint items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {["Certified Professional Instructors", "Dual-Controlled Modern Fleet", "Flexible Scheduling Controls", "Video Assessment Analysis"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs">✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-sm font-extrabold text-slate-950">Isaac Herman</p>
                <p className="text-xs text-slate-400 font-medium">Academy Founder & Director</p>
              </div>
              <div className="ml-auto flex gap-2">
                {['Facebook', 'Twitter', 'LinkedIn'].map((social, idx) => (
                  <span key={idx} className="text-xs font-bold text-slate-400 hover:text-yellow-600 cursor-pointer transition">
                    {social}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE STATISTICS ROW SECTION */}
      <section className="bg-slate-50 border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "4000+", label: "Qualified Drivers" },
              { value: "25+", label: "Professional Instructors" },
              { value: "98%", label: "First Time Pass Rate" },
              { value: "50+", label: "Modern Training Cars" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 border-r last:border-0 border-slate-200/60">
                <span className="text-3xl md:text-4xl font-black text-slate-950 mb-1">{stat.value}</span>
                <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CUSTOMIZED SERVICES SECTION (Dark Mode Grid Layout) */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-2 block">Our Expertise</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Services customized for you</h2>
            <div className="w-12 h-1 bg-yellow-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Student Driver Course",
                desc: "Complete safety frameworks focused on high-density intersections and defensive steering mechanisms.",
                img: "src/images/22.jpg"
              },
              {
                title: "License Preparation",
                desc: "Precise simulations of official highway assessment routes with continuous instructor mock reviews.",
                img: "src/images/7.jpg"
              },
              {
                title: "Road Safety Guide",
                desc: "Advanced night navigation and inclement weather operational control patterns for private drivers.",
                img: "src/images/8.jpg"
              }
            ].map((service, index) => (
              <div key={index} className="bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800 shadow-xl group hover:border-yellow-500/30 transition duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-0 left-0 bg-yellow-500 text-slate-950 px-3 py-2 font-bold text-xs uppercase tracking-wider">
                    Package 0{index + 1}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-neutral-100 group-hover:text-yellow-500 transition">{service.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">{service.desc}</p>
                  <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-500 hover:text-yellow-400 cursor-pointer">
                      View Details Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERLOCKING PRICING COURSES SECTION */}
      <section className="py-24 bg-white text-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-yellow-600 font-bold uppercase tracking-wider text-xs mb-2 block">Pricing Packages</span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Courses to drive with confidence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 relative">
            
            {/* Standard Package Option */}
            <div className="flex flex-col justify-between border border-slate-100 p-6 rounded-sm bg-slate-50/50">
              <div className="relative mb-6">
                <img src="src/images/10.jpg" alt="Standard Driving Course" className="w-full aspect-[4/3] object-cover rounded-xs shadow-sm" />
                <div className="absolute top-4 right-4 bg-slate-950 text-white px-4 py-2 font-black text-center shadow-lg border-l-2 border-yellow-500">
                  <p className="text-[16px] text-yellow-500 font-extrabold leading-none">$64.00</p>
                  <p className="text-[9px] font-medium tracking-wide mt-1 opacity-60">Fixed Rate</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Beginner Level</span>
                <h3 className="text-2xl font-extrabold text-slate-950 mb-4">Standard Driving Course</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Structured introduction focusing primarily on clutch balance mechanics, standard urban lane management, parking alignment metrics, and primary highway entry patterns.
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-b py-4 my-4 border-slate-200/60">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Theory Lessons</p>
                    <p className="text-sm font-bold text-slate-950">04 Full Hours</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Practical Drive</p>
                    <p className="text-sm font-bold text-slate-950">18 Full Hours</p>
                  </div>
                </div>

                <div className="bg-slate-950 text-neutral-300 text-xs font-medium p-3 rounded-xs border-l-2 border-yellow-500">
                  ⚠️ Driving test vehicle routes are coordinated separately.
                </div>
              </div>
            </div>

            {/* Extended Package Option */}
            <div className="flex flex-col justify-between border border-slate-100 p-6 rounded-sm bg-slate-50/50 md:translate-y-12">
              <div className="relative mb-6">
                <img src="src/images/23.jpg" alt="Extended Driving Course" className="w-full aspect-[4/3] object-cover rounded-xs shadow-sm" />
                <div className="absolute top-4 right-4 bg-slate-950 text-white px-4 py-2 font-black text-center shadow-lg border-l-2 border-yellow-500">
                  <p className="text-[16px] text-yellow-500 font-extrabold leading-none">$84.00</p>
                  <p className="text-[9px] font-medium tracking-wide mt-1 opacity-60">Fixed Rate</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Advanced Level</span>
                <h3 className="text-2xl font-extrabold text-slate-950 mb-4">Extended Driving Course</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Intensive highway control sequences, dynamic emergency avoidance modules, heavy commercial route layouts, and comprehensive test pre-screening.
                </p>

                <div className="grid grid-cols-2 gap-4 border-t border-b py-4 my-4 border-slate-200/60">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Theory Lessons</p>
                    <p className="text-sm font-bold text-slate-950">08 Full Hours</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Practical Drive</p>
                    <p className="text-sm font-bold text-slate-950">26 Full Hours</p>
                  </div>
                </div>

                <div className="bg-slate-950 text-neutral-300 text-xs font-medium p-3 rounded-xs border-l-2 border-yellow-500">
                  ⚠️ Driving test vehicle routes are coordinated separately.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      

    </div>
  );
}