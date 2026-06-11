import React from "react";

export default function About() {
  return (
    
    <div className="w-full bg-white font-sans antialiased text-gray-700">
        <section className="relative h-[30px] bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
        <img 
          src="src/images/hero.jpg" 
          alt="Single course banner background" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
       
      </section>

      
      {/* --- SECTION 1: Pioneer Info Grid --- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image with overlay text box */}
          <div className="lg:col-span-6 relative">
            <div className="w-full aspect-[4/3] sm:aspect-square max-w-lg mx-auto overflow-hidden rounded-sm bg-gray-100 shadow-sm">
              <img 
                src="src/images/2.jpg" 
                alt="Driving training session" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 12.6K Stats Overlay Badge */}
            <div className="absolute bottom-0 right-4 sm:right-12 bg-white px-6 py-4 shadow-xl flex items-center gap-4 rounded-xs border border-gray-100">
              <div className="text-right">
                <span className="block text-2xl font-black text-slate-900 leading-tight">12.6K</span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Training Hours</span>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-sm flex items-center justify-center text-black font-bold text-lg">
                ⏱
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Badges */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-md mb-6">
              udrive driving School has been a pioneer in the field of driving training since 2006!..
            </h2>
            
            <p className="text-xs text-gray-400 leading-relaxed mb-4 max-w-md">
              Explain to you how all this mistaken denouncing pleasure and praising pain was born and we will give you a complete account of the system, and expound the actual teachings.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed mb-8 max-w-md">
              Mistaken denouncing pleasure and praising pain was born and we will give you complete account of the system expound.
            </p>

            {/* Content Dropdowns / Accordions and Badge Items */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs font-bold text-slate-900 cursor-pointer">
                  <span>Our Statements</span>
                  <span className="text-[10px] opacity-60">▼</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-xs font-bold text-slate-900 cursor-pointer">
                  <span>Areas Covered</span>
                  <span className="text-[10px] opacity-40">▼</span>
                </div>
              </div>

              {/* Side Certification Badges */}
              <div className="flex gap-4 self-center sm:self-start">
                <div className="w-16 h-20 bg-white border border-gray-100 shadow-xs flex flex-col items-center justify-center p-2 rounded-xs">
                  <div className="text-xs text-center border-2 border-dashed border-slate-800 rounded-xs px-1 font-bold text-slate-800 scale-90">
                    BEST <br/><span className="text-[8px] font-normal">INSTITUTE</span>
                  </div>
                </div>
                <div className="w-16 h-20 bg-white border border-gray-100 shadow-xs flex flex-col items-center justify-center p-2 rounded-xs">
                  <div className="text-[10px] font-black text-center text-slate-800 border border-slate-800 rounded-full w-10 h-10 flex items-center justify-center">
                    ★ 5 ★
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION 2: 4000+ Counters Row --- */}
      <section className="bg-white border-t border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          
          {/* Big Graphic Text Row */}
          <div className="relative flex items-center justify-center mb-2">
            <div className="absolute left-0 right-0 h-[1px] bg-gray-200 z-0" />
            <h3 className="text-5xl md:text-6xl font-black text-slate-950 bg-white px-8 relative z-10 tracking-tight">
              4000+
            </h3>
          </div>
          <p className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-12">Happy Customers</p>

          {/* Metric Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { num: "5+", label: "Years of Experience" },
              { num: "27", label: "Professional Staff" },
              { num: "96%", label: "1st Time Pass Rate" },
              { num: "12.6K", label: "Total Training Hours" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center border-r last:border-0 border-gray-100 px-4">
                <span className="text-yellow-500 font-bold text-xs mb-2">○</span>
                <span className="text-2xl font-black text-slate-900 mb-1">{stat.num}</span>
                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- SECTION 3: Timeline Block Generation --- */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Alternating Stack */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Timeline Item 1 */}
            <div className="bg-white p-6 shadow-xs border border-gray-100/60 flex items-start gap-6 rounded-sm">
              <div className="w-20 h-20 bg-gray-200 overflow-hidden shrink-0">
                <img src="src/images/3.jpg" alt="2010 milestone" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-slate-300 font-black text-xl mb-1">
                  <span className="text-yellow-500 text-base font-normal">»</span> 2010
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Turn Into a Big</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="bg-white p-6 shadow-xs border border-gray-100/60 flex items-start gap-6 rounded-sm">
              <div className="w-20 h-20 bg-gray-200 overflow-hidden shrink-0">
                <img src="src/images/1.jpg" alt="2006 milestone" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-slate-300 font-black text-xl mb-1">
                  <span className="text-yellow-500 text-base font-normal">»</span> 2006
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">The Early Years</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  To take a trivial example which of us ever undertakes laborious physical exercise, except to obtain some advantage.
                </p>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button className="w-8 h-8 border border-gray-200 bg-white text-gray-400 text-xs hover:bg-slate-950 hover:text-white transition rounded-xs">
                  ▼
                </button>
                <button className="w-8 h-8 border border-gray-200 bg-white text-gray-400 text-xs hover:bg-slate-950 hover:text-white transition rounded-xs">
                  ▲
                </button>
              </div>
              <button className="bg-slate-950 text-white font-bold text-[10px] uppercase tracking-widest px-5 py-3 shadow-md hover:bg-slate-800 transition rounded-xs">
                Our Generation
              </button>
            </div>

          </div>

          {/* Right Column: Angled Frame Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full aspect-[4/3] max-w-md bg-gray-100 rounded-bl-[80px] overflow-hidden shadow-lg border border-gray-200">
              <img 
                src="src/images/5.jpg" 
                alt="Cheerful dynamic instructor profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}