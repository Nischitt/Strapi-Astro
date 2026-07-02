// ============================================================
// DESIGN NOTES (IMPLEMENTED):
// Subject: a driving school. Real visual world = road signage,
// lane lines, the pass/fail binary of a driving test.
//
// Palette (Mapped to Tailwind Arbitrary Values for exact match)
//  asphalt   #1B1F1C  near-black, slightly warm/green
//  chalk     #F3EFE6  paper/chalk background
//  signal    #FFC629  road-sign yellow — flat blocks only
//  pass      #2B5D3F  driving-test green
//  fail      #B23A2E  brake-light red
//  ink-soft  #6B655A  warm gray body text
// ============================================================

import React from "react";

export default function About() {
  return (
    <div className="w-full bg-[#F3EFE6] text-[#1B1F1C] font-sans antialiased overflow-x-hidden selection:bg-[#FFC629] selection:text-[#1B1F1C]">
      
      {/* HERO SECTION */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-[#1B1F1C] border-b-8 border-[#FFC629]">
        <img
          src="/images/Hero.jpg"
          alt="About Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />

        <div className="relative z-10 text-center text-[#F3EFE6] px-6">
          {/* Display Typography: Tight, heavy, uppercase signage-like Grotesk stack */}
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            About uDrive
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#6B655A] leading-relaxed font-normal">
            Empowering safe and confident drivers since 20+ years of Experience with professional
            instructors, modern vehicles, and proven training methods.
          </p>
        </div>
      </section>
         
      {/* SECTION 1: Pioneer Info Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sharp frame-in-frame layout */}
          <div className="lg:col-span-6 relative">
            <div className="w-full h-[650px] sm:aspect-square max-w-lg mx-auto overflow-hidden border-4 border-[#1B1F1C] bg-neutral-200">
              <img 
                src="/images/2.jpg" 
                alt="Driving training session" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Flat Solid Badges replacing soft rounded floating boxes */}
            <div className="absolute bottom-8 left-8 bg-[#1B1F1C] text-[#F3EFE6] border-2 border-[#FFC629] px-6 py-5 shadow-none">
              <h3 className="text-3xl font-black tracking-tight text-[#FFC629]">
                12.6K+
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Training Hours Completed
              </p>
            </div>
          </div>

          {/* Right Column: Content Details & Grid Logs */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            <span className="text-[#6B655A] font-mono uppercase tracking-widest text-xs mb-3 block">
              About uDrive
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-[#1B1F1C] uppercase tracking-tighter leading-none mb-6">
              Driving Success Since
              <span className="bg-[#FFC629] text-[#1B1F1C] px-2 ml-2 inline-block transform -rotate-1">2006</span>
            </h2>

            <p className="text-[#6B655A] leading-relaxed text-base mb-6">
              At uDrive Driving School, we are committed to helping learners become
              confident, responsible, and skilled drivers. Our certified instructors
              combine classroom learning with practical road experience to ensure
              every student develops safe driving habits for life.
            </p>

            <p className="text-[#6B655A] leading-relaxed text-base mb-8">
              With more than 20 years of excellence, we have trained thousands of
              successful drivers and maintained one of the highest first-time pass
              rates in the region.
            </p>

            {/* Feature Cards: Transformed into Stiff Structural Logs */}
            <div className="grid grid-cols-2 gap-3 mb-8 bg-[#1B1F1C] p-2 border border-[#1B1F1C]">
              {[
                { label: "8000+", desc: "Successful Students" },
                { label: "98%", desc: "First-Time Pass Rate" },
                { label: "20+", desc: "Years Experience" },
                { label: "25+", desc: "Professional Instructors" }
              ].map((card, i) => (
                <div key={i} className="bg-[#F3EFE6] p-4 border border-[#1B1F1C]">
                  <h4 className="font-black text-2xl uppercase tracking-tight text-[#1B1F1C]">
                    {card.label}
                  </h4>
                  <p className="text-xs font-mono uppercase tracking-tight text-[#6B655A]">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Check List using pure "Pass Green" Binary Indicators */}
            <div className="space-y-3 mb-8">
              {[
                "Certified Driving Instructors",
                "Modern Dual-Control Vehicles",
                "Flexible Lesson Scheduling",
                "Highway & Test Route Training"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-[#2B5D3F] flex items-center justify-center text-[#F3EFE6] text-[10px] font-mono font-bold">
                    ✓
                  </span>
                  <span className="font-bold uppercase text-xs tracking-tight text-[#1B1F1C]">
                    {text}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-[#1B1F1C] text-[#F3EFE6] border-t-4 border-b-4 border-neutral-800">
        <div className="max-w-6xl mx-auto px-6">

          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tight text-[#F3EFE6]">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1B1F1C] p-8 border-2 border-neutral-800 border-l-8 border-l-[#FFC629]">
              <h3 className="text-xl font-black text-[#FFC629] uppercase tracking-wider font-mono mb-4">
                Our Mission
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                To provide safe, affordable, and professional driving education
                that prepares students for real-world driving situations.
              </p>
            </div>

            <div className="bg-[#1B1F1C] p-8 border-2 border-neutral-800 border-l-8 border-l-[#2B5D3F]">
              <h3 className="text-xl font-black text-[#FFC629] uppercase tracking-wider font-mono mb-4">
                Our Vision
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                To be the most trusted driving school known for producing
                confident and responsible drivers.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CORE BENEFITS SEQUENCE STRIP */}
      <section className="py-24 bg-[#F3EFE6]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight text-[#1B1F1C]">
              Why Students Choose uDrive
            </h2>
          </div>

          {/* Cards look like logged items inside a sequential strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-4 border-[#1B1F1C] bg-[#1B1F1C] p-2 gap-2">
            {[
              "Certified Instructors",
              "Modern Training Cars",
              "Flexible Scheduling",
              "98% Pass Rate",
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-[#F3EFE6] border border-[#1B1F1C] flex flex-col justify-between text-center"
              >
                <div className="inline-block bg-[#1B1F1C] text-[#FFC629] font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 mx-auto mb-6">
                  Log_Seq_0{index + 1}
                </div>

                <h3 className="font-black text-lg uppercase tracking-tight text-[#1B1F1C] mb-2">
                  {item}
                </h3>
                
                <div className="text-[10px] font-mono uppercase text-neutral-400 mt-4 pt-4 border-t border-neutral-200">
                  Status: Standard
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HIGH CONTRAST MATTE CALL TO ACTION */}
      <section className="py-24 bg-[#FFC629] border-t-8 border-[#1B1F1C]">
        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-4xl md:text-6xl font-black text-[#1B1F1C] tracking-tighter uppercase leading-none mb-6">
            Ready To Start Your Driving Journey?
          </h2>

          <p className="text-[#1B1F1C]/80 text-base md:text-lg mb-8 max-w-md mx-auto font-normal">
            Join thousands of successful drivers trained by uDrive.
          </p>

          <button className="bg-[#1B1F1C] text-[#F3EFE6] hover:bg-neutral-800 px-10 py-5 font-black text-xs tracking-widest uppercase border-4 border-[#1B1F1C] hover:border-neutral-800 transition duration-150 shadow-none">
            Enroll Now
          </button>

        </div>
      </section>

    </div>
  );
}