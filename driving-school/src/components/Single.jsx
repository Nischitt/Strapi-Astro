import React from "react";

export default function Single() {
  return (
    <div className="w-full bg-white font-sans text-gray-700 antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-slate-950">
      
      {/* =========================================================================
          HERO BANNER HEADER
          ========================================================================= */}
      <section className="relative h-[240px] bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
        <img 
          src="src/images/hero.jpg" 
          alt="Single course banner background" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Standard Driving Course</h1>
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
            <span className="hover:text-yellow-500 cursor-pointer transition">Courses</span>
            <span className="text-yellow-500 font-normal">»</span>
            <span className="text-white">Standard Course Details</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN COURSE DETAIL INTERFACE BREAKDOWN
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT AREA: Principal Technical Syllabus Data */}
          <div className="lg:col-span-8 space-y-8">
            <div className="w-full aspect-[16/9] rounded-xs overflow-hidden shadow-sm border border-gray-100">
              <img src="src/images/10.jpg" alt="Standard Course Action View" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Course Architecture Overview</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Explain to you how all this mistaken denouncing pleasure and praising pain was born and we will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                But occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it?
              </p>
            </div>

            {/* Core Syllabus Checklist Matrix */}
            <div className="bg-slate-50 p-6 border border-gray-100 rounded-xs">
              <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider mb-4">What You Will Master</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                {["Clutch & Shift Synchronization Control", "Parallel Parking Alignment Markers", "Emergency Braking Threshold Calculations", "Dual-Carriageway Lane Changing Discipline", "Night Operational Hazard Visual Range", "Pre-Test Evaluation Scoring Requirements"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-yellow-500 font-bold">»</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT AREA: Registration Context Sticky Column Widget */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Box Module 1: Pricing & Action Matrix */}
            <div className="bg-neutral-900 text-white p-6 rounded-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full filter blur-xl" />
              
              <div className="border-b border-neutral-800 pb-4 mb-4">
                <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400 block mb-1">TOTAL TUITION COST</span>
                <div className="text-yellow-500">
                  <span className="text-sm font-bold align-top">$</span>
                  <span className="text-4xl font-black tracking-tight">64</span>
                  <span className="text-xs font-bold">.00</span>
                </div>
              </div>

              {/* Course Specifications Metadata */}
              <ul className="space-y-3 text-xs text-neutral-400 border-b border-neutral-800 pb-6 mb-6 font-medium">
                <li className="flex justify-between"><span>Theory Module:</span> <span className="text-white font-bold">04 Hours</span></li>
                <li className="flex justify-between"><span>Behind-the-Wheel:</span> <span className="text-white font-bold">18 Hours</span></li>
                <li className="flex justify-between"><span>Course Length:</span> <span className="text-white font-bold">30 Days Max</span></li>
                <li className="flex justify-between"><span>Instructor Assigned:</span> <span className="text-yellow-500 font-bold">Isaac Herman</span></li>
              </ul>

              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-[10px] tracking-widest uppercase py-3.5 transition">
                ENROLL IN COURSE NOW
              </button>
            </div>

           

          </div>

        </div>
      </section>

    </div>
  );
}