import React, { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      category: e.target.category.value,
      instructor: e.target.instructor.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        e.target.reset(); // Clear form
      } else {
        setStatus("Failed to send. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("Error connecting to server.");
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-700 antialiased overflow-x-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative h-[280px] bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
        <img src="src/images/contact-banner.jpg" alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Contact</h1>
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
            <a href="/Hero" className="hover:text-yellow-500">Home</a>
            <span className="text-yellow-500">»</span>
            <span>Contact</span>
          </div>
        </div>
      </section>

      {/* 2. ENQUIRY FORM */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 shadow-2xl rounded-sm overflow-hidden">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 bg-neutral-900 text-neutral-300 p-10 flex flex-col justify-between">
              <div className="space-y-8">
                {/* Simplified for brevity - add your location/contact details here */}
                <div>
                    <h4 className="text-xs font-bold text-white uppercase mb-1">We are Here</h4>
                    <p className="text-xs text-neutral-400">PO Box 16122, Melbourne</p>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-[#161616] p-10">
              <h3 className="text-xl font-bold text-white mb-1">Send your enquiry</h3>
              <p className="text-[11px] text-neutral-400 mb-8">We will get back to you soon.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="Your Name" required className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-yellow-500" />
                  <input name="phone" type="text" placeholder="Phone" required className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-yellow-500" />
                </div>
                <input name="email" type="email" placeholder="Email Address" required className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-white outline-none focus:border-yellow-500" />
                
                <select name="category" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-neutral-400 outline-none">
                  <option value="student">Student Driver Course</option>
                  <option value="license">License Preparation</option>
                </select>
                
                <select name="instructor" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-neutral-400 outline-none">
                  <option value="isaac">Isaac Herman</option>
                </select>

                <textarea name="message" rows="4" placeholder="Message" className="w-full bg-neutral-900 border border-neutral-800 p-3 text-xs text-white outline-none" required></textarea>

                <button type="submit" className="bg-yellow-500 text-slate-950 font-bold text-[9px] uppercase tracking-widest px-6 py-3.5 hover:bg-yellow-400 transition">
                  Submit Enquiry
                </button>
              </form>
              {status && <p className="text-xs text-yellow-500 mt-4">{status}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}