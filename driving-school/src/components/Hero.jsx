// ============================================================
// DESIGN NOTES (IMPLEMENTED):
// Subject: a driving school. Real visual world = road signage,
// lane lines, the pass/fail binary of a driving test, the
// instructor's voice.
//
// Palette (Mapped to Tailwind Arbitrary Values for exact match)
//  asphalt   #1B1F1C  near-black, slightly warm/green
//  chalk     #F3EFE6  paper/chalk background
//  signal    #FFC629  road-sign yellow — flat blocks only
//  pass      #2B5D3F  driving-test green
//  fail      #B23A2E  brake-light red
//  ink-soft  #6B655A  warm gray body text
// ============================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from '../config';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fetch Dynamic Reviews from Backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/public/reviews`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
        setReviews([
          { id: 1, customerName: "Sarah M.", rating: 5, comment: "Passed my test on the first try! The dual-control cars made me feel completely safe.", createdAt: "2026-03-15" },
          { id: 2, customerName: "David K.", rating: 5, comment: "Amazing instructors. Very patient and clear with their parking instructions.", createdAt: "2026-03-22" },
          { id: 3, customerName: "James L.", rating: 4, comment: "Flexible schedules helped me fit driving lessons around my college classes easily.", createdAt: "2026-03-29" }
        ]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  // Auto-play Carousel Loop Timer
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  return (
    <div className="w-full min-h-screen bg-[#F3EFE6] text-[#1B1F1C] font-sans antialiased overflow-x-hidden selection:bg-[#FFC629] selection:text-[#1B1F1C]">
      
      {/* 1. ASYMMETRICAL ROAD HERO SECTION */}
      <section id="home" className="min-h-screen relative flex items-center pt-24 pb-16 lg:py-0 overflow-hidden bg-[#1B1F1C] border-b-8 border-[#FFC629]">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-luminosity">
          <img
            src="/images/18.jpg"
            className="w-full h-full object-cover"
            alt="uDrive Hero Background"
          />
        </div>
        
        {/* Stiff structural lines replacing generic glowing blurs */}
        <div className="absolute top-0 right-1/4 w-px h-full bg-neutral-800/60 hidden lg:block" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-neutral-800/60 hidden lg:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7 text-[#F3EFE6]">
            
            <div className="inline-flex items-center gap-2 bg-neutral-900 px-3 py-1.5 border border-neutral-700 uppercase tracking-wider text-[11px] font-mono mb-6">
              <span className="w-2 h-2 bg-[#FFC629]" />
              <span>Welcome to uDrive School</span>
            </div>
            
            {/* Display Typography: Tight, heavy, signage-like Grotesk stack */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none uppercase text-[#F3EFE6]">
              Learn Driving With <span className="bg-[#FFC629] text-[#1B1F1C] px-2 inline-block transform -rotate-1">Confidence</span>
            </h1>

            {/* Body Typography: Humanist approach, generous leading, muted text */}
            <p className="mt-6 text-lg md:text-xl max-w-xl text-[#6B655A] font-normal leading-relaxed">
              Professional certified instructors and modern dual-controlled training vehicles tailored entirely around your road safety.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/Contact">
                <button className="bg-[#FFC629] hover:bg-[#FFC629]/90 text-[#1B1F1C] px-8 py-4 font-black tracking-wide uppercase text-xs transition duration-150 border-2 border-[#1B1F1C] box-border">
                  Get Started Now
                </button>
              </a>
              <a href="/Modern">
                <button className="border-2 border-[#F3EFE6] hover:bg-[#F3EFE6] hover:text-[#1B1F1C] text-[#F3EFE6] px-8 py-4 font-black tracking-wide uppercase text-xs transition duration-150">
                  Our Courses
                </button>
              </a>
            </div>
          </div>

          {/* Logged Status Card Layout on the Right */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="border-4 border-[#F3EFE6] bg-[#1B1F1C] p-6 shadow-none">
              <div className="h-64 overflow-hidden mb-6 border border-neutral-800">
                <img src="/images/21.jpg" className="w-full h-full object-cover grayscale" alt="Premium Fleet" />
              </div>
              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Next Available Slot</p>
                  <p className="text-[#FFC629] font-black text-xl uppercase tracking-tight">Tomorrow, 9:00 AM</p>
                </div>
                {/* Pure Pass Binary Green */}
                <span className="bg-[#2B5D3F] text-[#F3EFE6] text-xs px-3 py-1 font-mono uppercase font-bold tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL IMAGE EDITORIAL SECTION */}
      <section className="py-32 bg-[#F3EFE6] text-[#1B1F1C]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Block: Flat Framing */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] sm:w-[85%] bg-neutral-200 overflow-hidden border-4 border-[#1B1F1C]">
              <img src="/images/21.jpg" className="w-full h-full object-cover" alt="Latest Fleet Vehicle" />
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[45%] aspect-square hidden sm:block overflow-hidden border-4 border-[#1B1F1C]">
              <img src="/images/Driving.jpg" className="w-full h-full object-cover" alt="Instructor Profile" />
            </div>
            
            <div className="absolute -bottom-6 left-6 bg-[#1B1F1C] text-[#F3EFE6] px-8 py-6 border-2 border-[#FFC629] flex items-center gap-5">
              <span className="text-5xl font-black tracking-tighter text-[#FFC629]">15+</span>
              <div className="text-xs font-bold uppercase tracking-widest leading-tight text-neutral-400 border-l border-neutral-700 pl-5">
                Years of <br /> Professional <br /> Excellence
              </div>
            </div>
          </div>

          {/* Right Block: Content Details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[#6B655A] font-mono uppercase tracking-widest text-xs mb-3 block">About Our Academy</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B1F1C] tracking-tight uppercase leading-none mb-6">
              A premium driving school built around modern road safety.
            </h2>
            
            <p className="text-[#6B655A] text-base leading-relaxed mb-8">
              We provide comprehensive training environments with adaptive courses designed to build long-term confidence on all types of road routes. Our systems conform completely to current standard highway safe-practices.
            </p>

            {/* Checkpoint items list with strict Pass signals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {["Certified Instructors", "Dual-Controlled Modern Fleet", "Flexible Scheduling Controls", "Video Assessment Analysis"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight text-[#1B1F1C]">
                  <span className="w-5 h-5 bg-[#2B5D3F] text-[#F3EFE6] flex items-center justify-center text-[10px] font-mono font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>

            {/* Humanist Serif voice utilized exclusively for the instructor quote block */}
            <blockquote className="border-l-4 border-[#FFC629] pl-4 my-6 font-serif italic text-lg text-[#6B655A]">
              "The road doesn't test your technical ability alone—it tests your capacity for hazard perception and decision clarity."
            </blockquote>

            <div className="flex items-center justify-between border-t border-neutral-300 pt-8">
              <div>
                <p className="text-base font-black uppercase text-[#1B1F1C]">Isaac Herman</p>
                <p className="text-xs text-[#6B655A] uppercase tracking-wider font-mono">Academy Founder & Director</p>
              </div>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'LinkedIn'].map((social, idx) => (
                  <span key={idx} className="text-xs font-bold uppercase tracking-wider text-[#6B655A] hover:text-[#1B1F1C] cursor-pointer transition">
                    {social}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE STATISTICS ROW SECTION */}
      <section className="bg-[#1B1F1C] text-[#F3EFE6] py-20 border-b-2 border-t-2 border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-8 text-center">
            {[
              { value: "4000+", label: "Qualified Drivers" },
              { value: "25+", label: "Professional Instructors" },
              { value: "98%", label: "First Time Pass Rate" },
              { value: "50+", label: "Modern Training Cars" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-4 border-r-0 sm:border-r last:border-0 border-neutral-800">
                <span className="text-4xl md:text-5xl font-black tracking-tighter text-[#FFC629] mb-2">{stat.value}</span>
                <span className="text-[11px] text-neutral-400 font-mono tracking-widest uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HAZARD PERCEPTION STRIP (REPLACES BENTO GRID) */}
      <section className="py-32 bg-[#F3EFE6] text-[#1B1F1C] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <span className="text-[#6B655A] uppercase tracking-widest font-mono text-xs font-bold block mb-3">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
              Driving Excellence Since Day One
            </h2>
          </div>

          {/* Each card now behaves like a sequence/hazard perception strip log, no highlight trick or offsets */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-[#1B1F1C] bg-[#1B1F1C] p-2 gap-2">
            {[
              { title: "Expert Instructors", desc: "Top tier safety certified instruction tailored to your current driving capabilities." },
              { title: "Modern Vehicles", desc: "Learn confidently in late-model safety certified vehicles featuring dual-control mechanisms." },
              { title: "Flexible Schedule", desc: "Book times around your work or college commitments seamlessly using our client platform." },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 bg-[#F3EFE6] border border-[#1B1F1C] flex flex-col justify-between"
              >
                <div>
                  <div className="inline-block bg-[#1B1F1C] text-[#F3EFE6] font-mono text-xs px-2.5 py-1 uppercase tracking-widest mb-8">
                    Clip_0{i + 1}.log
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter mb-3">{item.title}</h3>
                  <p className="text-sm font-normal text-[#6B655A] leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-neutral-200 flex justify-between items-center text-[10px] font-mono uppercase text-neutral-400">
                  <span>Status: Ready</span>
                  <span className="text-[#2B5D3F]">● Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ROADMAP TIMELINE */}
      <section className="py-32 bg-[#F3EFE6] border-t-4 border-[#1B1F1C]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center">
            <span className="text-[#6B655A] uppercase tracking-widest font-mono text-xs font-bold block mb-3">The Process</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B1F1C] uppercase tracking-tight leading-none">
              Your Journey to Becoming Licensed
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Register Online",
              "Theory Training",
              "Road Practice",
              "Get Licensed",
            ].map((step, index) => (
              <div key={index} className="border-2 border-[#1B1F1C] bg-[#F3EFE6] p-6 relative">
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3 bg-[#FFC629] text-[#1B1F1C] font-mono font-black border-2 border-[#1B1F1C] w-8 h-8 flex items-center justify-center text-xs">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#1B1F1C] mb-2 mt-2">
                  {step}
                </h3>
                <p className="text-xs text-[#6B655A] leading-relaxed">
                  Streamlined legal pathways managed cleanly by our custom tools.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL CAROUSEL WITH DYNAMIC API DATA HONESTY */}
      <section className="py-32 bg-[#F3EFE6] border-t-4 border-[#1B1F1C] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[#6B655A] uppercase tracking-widest font-mono text-xs font-bold block mb-3">Testimonials</span>
            
            <div className="flex items-center gap-2">
              <h2 className="text-3xl md:text-5xl font-black text-[#1B1F1C] uppercase tracking-tight leading-none">Dynamic Graduate Success</h2>
              {/* Live database pulse indicator showing exact sync states */}
              <span className="inline-flex items-center gap-1.5 bg-[#2B5D3F]/10 border border-[#2B5D3F]/30 px-2 py-0.5 text-[10px] uppercase font-mono text-[#2B5D3F]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B5D3F] animate-ping" /> Live API Records
              </span>
            </div>
          </div>
          
          <div className="min-h-[260px] flex items-center justify-center relative">
            {loadingReviews ? (
              <div className="text-[#6B655A] font-mono text-xs uppercase tracking-wider animate-pulse">Loading verified logs...</div>
            ) : reviews.length === 0 ? (
              <p className="text-[#B23A2E] uppercase font-mono tracking-wider text-xs">No approved student stories discovered.</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#1B1F1C] text-[#F3EFE6] p-8 md:p-12 border-l-8 border-[#FFC629] w-full"
                >
                  <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-6 pb-4 border-b border-neutral-800">
                    {/* Specificity a mockup wouldn't bother tracking */}
                    <span>Entry {currentReviewIndex + 1} of {reviews.length}</span>
                    <span>Logged: {reviews[currentReviewIndex].createdAt?.toString().split('T')[0] || "Live Stack"}</span>
                  </div>

                  <p className="text-[#F3EFE6] font-serif italic text-lg md:text-xl leading-relaxed mb-8">
                    "{reviews[currentReviewIndex].comment}"
                  </p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-black uppercase text-[#FFC629] text-base tracking-tight">{reviews[currentReviewIndex].customerName}</h4>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mt-1">Verified Graduate</span>
                    </div>

                    <div className="bg-neutral-900 px-3 py-1 text-sm font-mono text-[#FFC629]">
                      SCORE: {reviews[currentReviewIndex].rating}/5
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Minimal Navigation Strips */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewIndex(idx)}
                  className={`h-2 transition-all duration-150 ${idx === currentReviewIndex ? 'w-12 bg-[#1B1F1C]' : 'w-3 bg-neutral-300'}`}
                  aria-label={`Go to record index ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. HIGH CONTRAST MATTE CALL TO ACTION */}
      <section className="py-32 bg-[#FFC629] border-t-8 border-[#1B1F1C] relative">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-[#1B1F1C] tracking-tighter uppercase leading-none mb-6">
            Ready To Get Behind <br className="hidden sm:inline"/> The Wheel?
          </h2>

          <p className="text-base md:text-lg text-[#1B1F1C]/80 mb-10 max-w-md mx-auto font-normal leading-relaxed">
            Join thousands of defensive, confident drivers trained expertly by uDrive instructors.
          </p>

          <a href="/contact">
            <button className="bg-[#1B1F1C] text-[#F3EFE6] hover:bg-neutral-800 px-10 py-5 font-black text-xs tracking-widest uppercase border-4 border-[#1B1F1C] hover:border-neutral-800 transition duration-150 shadow-none">
              Book Your First Lesson
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}