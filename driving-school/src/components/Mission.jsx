import React from "react";

export default function Mission() {
  return (
    <div className="w-full bg-white font-sans text-gray-700 antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-slate-950">
      
      {/* =========================================================================
          HERO BANNER HEADER
          ========================================================================= */}
      <section className="relative h-[240px] bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
        <img 
          src="src/images/contact-banner.jpg" 
          alt="Mission vision background" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Mission & Vision</h1>
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
            <span className="hover:text-yellow-500 cursor-pointer transition">Home</span>
            <span className="text-yellow-500 font-normal">»</span>
            <span className="text-white">Our Framework</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STRATEGIC CORE VALUES SEGMENTS
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-24">
          
          {/* Row 1: The Core Mission Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500 font-bold text-sm tracking-tighter">////</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Our Strategic Intent</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-4">
                Our Mission: To cultivate safe, confident drivers for a lifetimes' roadway journey
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Explain to you how all this mistaken denouncing pleasure and praising pain was born and we will give you a complete account of the system, and expound the actual teachings.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Mistaken denouncing pleasure and praising pain was born and we will give you complete account of the system expound safely.
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="w-full aspect-[4/3] rounded-sm overflow-hidden shadow-md border border-gray-100">
                <img src="src/images/19.jpg" alt="Our Mission graphic" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Row 2: The Core Vision Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6 order-last md:order-first">
              <div className="w-full aspect-[4/3] rounded-sm overflow-hidden shadow-md border border-gray-100">
                <img src="src/images/1.jpg" alt="Our Vision graphic" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500 font-bold text-sm tracking-tighter">»»»»»</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Future Outlook</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-4">
                Our Vision: Setting global benchmarks for modern defensive automotive safety instruction
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil pain.
              </p>
              
              <div className="bg-slate-950 text-neutral-300 text-[10px] font-medium p-3 rounded-xs flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center text-[9px] font-bold font-mono">✓</span>
                Committed to reaching absolute zero instruction incident rates.
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}