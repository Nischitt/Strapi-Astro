import React, { useState, useEffect } from "react";

export default function HomeContent() {
  // State buckets for database records
  const [packages, setPackages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CMS BOOKING POPUP STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Tracks chosen package or course
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitStatus, setSubmitStatus] = useState("");

  // Pull data from your Node API server on load
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/packages").then((res) => res.json()),
      fetch("http://localhost:5000/api/courses").then((res) => res.json())
    ])
      .then(([packagesData, coursesData]) => {
        setPackages(packagesData);
        setCourses(coursesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error communicating with backend API:", err);
        setLoading(false);
      });
  }, []);

  // Opens the popup modal form with custom item tracking data
  const handleOpenBooking = (item, type) => {
    setSelectedItem({
      name: item.name || item.title,
      price: item.price || item.startingPrice,
      type: type
    });
    setIsModalOpen(true);
    setSubmitStatus("");
  };

  // Sends the form inputs down to your Express backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("Processing...");

    const payload = {
      studentName: formData.name,
      studentEmail: formData.email,
      studentPhone: formData.phone,
      itemType: selectedItem.type,
      itemName: selectedItem.name,
      itemPrice: selectedItem.price
    };

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSubmitStatus("Success! Our instructor team will call you shortly.");
        setFormData({ name: "", email: "", phone: "" });
        setTimeout(() => setIsModalOpen(false), 2500); // Autoclose modal
      } else {
        setSubmitStatus("Submission failed. Please try again.");
      }
    } catch (err) {
      setSubmitStatus("Server error connecting to database.");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#111111] flex flex-col justify-center items-center text-white font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Synchronizing Live Database...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-sans text-gray-700 antialiased overflow-x-hidden relative">

      {/* =========================================================================
          SECTION 1: HERE TO HELP YOU BECOME A GREAT DRIVER (STATIC FEATURES)
          ========================================================================= */}
      <section className="py-20 bg-[#111111] text-white relative">
        <div className="absolute top-10 left-6 flex gap-1 select-none">
          <span className="text-yellow-500 font-bold tracking-tighter text-sm">////</span>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Here to help you become<br />a great driver
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "01", title: "Trained Instructors", desc: "Denounce with righteous indignation & men who are so beguiled." },
              { id: "02", title: "Fair Pricing Plans", desc: "In a free hour when our power of choice when nothing prevents." },
              { id: "03", title: "Well Maintained Vehicles", desc: "The duties of duty or the obligations business frequently occur that pleasure." },
              { id: "04", title: "Best Safety Measures", desc: "Blame cases states the obligation business frequently occur that pleasure." },
              { id: "05", title: "Pick Up & Drop Off On Time", desc: "Denounce with righteous indignation & men who are so beguiled." },
              { id: "06", title: "Flexible Course Completion", desc: "Nails free hour when our power of choice when nothing well prevents." }
            ].map((item, index) => (
              <div key={index} className="bg-white text-slate-900 p-6 border border-gray-100 rounded-sm relative shadow-sm flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xs font-black text-slate-950 tracking-wide uppercase">{item.title}</h4>
                    <span className="text-[10px] font-bold text-gray-300 border-b border-gray-100 pb-0.5">{item.id}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: VALUABLE PACKAGES & OFFERS (DYNAMIC MONGO DATA)
          ========================================================================= */}
      <section className="py-20 bg-slate-50 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Valuable Packages & Offers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto items-stretch">
            {packages.map((pkg) => {
              const priceString = (pkg.price || 0).toFixed(2);
              const [dollars, cents] = priceString.split(".");

              if (pkg.isPopular) {
                return (
                  <div key={pkg.id || pkg._id} className="bg-slate-950 border-2 border-yellow-500 rounded-sm p-6 flex flex-col justify-between shadow-xl text-center relative overflow-hidden transform md:-translate-y-2">
                    <div className="absolute top-0 right-0 bg-yellow-500 text-slate-950 text-[7px] font-black tracking-widest uppercase py-1 px-6 rotate-45 translate-x-4 translate-y-2">
                      POPULAR
                    </div>
                    <div>
                      <div className="text-yellow-500 mb-4">
                        <span className="text-xs font-bold align-top">$</span>
                        <span className="text-4xl font-black tracking-tight">{dollars}</span>
                        <span className="text-xs font-bold">.{cents}</span>
                        <p className="text-[8px] text-neutral-400 uppercase tracking-wider font-bold mt-1">PER COURSE</p>
                      </div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-3 mb-4">{pkg.name}</h3>
                      <p className="text-[11px] text-neutral-400 italic mb-6">{pkg.tagline}</p>
                      
                      <ul className="text-[11px] text-neutral-300 space-y-3.5 text-left max-w-[160px] mx-auto font-medium">
                        <li className="flex justify-between"><span>Theory</span> <span className="font-bold text-white">{pkg.theoryLessons} Lessons</span></li>
                        <li className="flex justify-between"><span>Practical</span> <span className="font-bold text-white">{pkg.practicalLessons} Lessons</span></li>
                        <li className="flex justify-between"><span>Duration</span> <span className="font-bold text-white">{pkg.durationDays || 30} Days</span></li>
                        <li className="flex justify-between"><span>Car Type</span> <span className="font-bold text-white">{pkg.carType || 'Basic Model'}</span></li>
                        <li className="flex justify-between border-t border-neutral-800 pt-2.5"><span>Free Pickup</span> <span className="font-bold text-yellow-500">{pkg.freePickup ? 'Yes' : 'No'}</span></li>
                      </ul>
                    </div>
                    {/* Added handleOpenBooking onClick hook */}
                    <button 
                      onClick={() => handleOpenBooking(pkg, "package")}
                      className="mt-8 w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[9px] font-bold uppercase tracking-widest py-3.5 transition shadow-lg shadow-yellow-500/10"
                    >
                      BOOK NOW
                    </button>
                  </div>
                );
              }

              return (
                <div key={pkg.id || pkg._id} className="bg-white border border-gray-200/80 rounded-sm p-6 flex flex-col justify-between shadow-xs text-center">
                  <div>
                    <div className="text-slate-950 mb-4">
                      <span className="text-xs font-bold align-top">$</span>
                      <span className="text-3xl font-black tracking-tight">{dollars}</span>
                      <span className="text-xs font-bold">.{cents}</span>
                      <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mt-1">PER COURSE</p>
                    </div>
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">{pkg.name}</h3>
                    <p className="text-[11px] text-gray-400 italic mb-6">{pkg.tagline}</p>
                    
                    <ul className="text-[11px] text-slate-600 space-y-3.5 text-left max-w-[160px] mx-auto font-medium">
                      <li className="flex justify-between"><span>Theory</span> <span className="font-bold text-slate-950">{pkg.theoryLessons} Lessons</span></li>
                      <li className="flex justify-between"><span>Practical</span> <span className="font-bold text-slate-950">{pkg.practicalLessons} Lessons</span></li>
                      <li className="flex justify-between"><span>Duration</span> <span className="font-bold text-slate-950">{pkg.durationDays || 30} Days</span></li>
                      <li className="flex justify-between"><span>Car Type</span> <span className="font-bold text-slate-950">{pkg.carType || 'Basic Model'}</span></li>
                    </ul>
                  </div>
                  {/* Added handleOpenBooking onClick hook */}
                  <button 
                    onClick={() => handleOpenBooking(pkg, "package")}
                    className="mt-8 w-full bg-slate-950 hover:bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest py-3 transition"
                  >
                    BOOK NOW
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: COURSE TO DRIVE WITH CONFIDENCE (DYNAMIC MONGO DATA)
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="text-center mb-14 relative">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Course to drive with confidence</h2>
            <div className="absolute right-0 top-0 text-yellow-500 tracking-tighter text-sm font-bold select-none opacity-50 pointer-events-none">»»»»»</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 relative">
            {courses.map((course, index) => {
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={course.id || course._id} 
                  className={`flex flex-col justify-between border border-gray-100 bg-white p-5 shadow-xs rounded-xs relative ${
                    !isEven ? 'md:translate-y-16' : ''
                  }`}
                >
                  {!isEven && (
                    <div className="absolute left-[-24px] top-[-30px] text-yellow-500 tracking-tighter text-sm font-bold select-none opacity-50 pointer-events-none hidden md:block">»»»»»</div>
                  )}

                  {isEven && (
                    <div className="relative mb-6">
                      <img src={course.image || "src/images/6.jpg"} alt={course.title} className="w-full aspect-[4/3] object-cover rounded-xs" />
                      <div className="absolute top-0 right-4 bg-yellow-500 text-slate-950 px-3 py-2 text-center shadow-md font-sans">
                        <p className="text-[8px] uppercase tracking-tighter font-bold opacity-70">FROM</p>
                        <p className="text-lg font-black leading-none">${course.startingPrice}</p>
                        <p className="text-[8px] font-medium mt-0.5 whitespace-nowrap">Per Person</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block mb-1">OUR COURSES</span>
                    <h3 className="text-xl font-extrabold text-slate-950 mb-3">{course.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">{course.description}</p>

                    <div className="grid grid-cols-2 gap-4 border-t border-b py-3 my-4 border-gray-100 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-base text-yellow-500">⏱</span>
                        <div>
                          <p className="text-[9px] uppercase font-bold text-slate-950 tracking-wide leading-none">THEORY SESSION</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{course.theoryHours || 4} Hours</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base text-yellow-500">📍</span>
                        <div>
                          <p className="text-[9px] uppercase font-bold text-slate-950 tracking-wide leading-none">PRACTICAL SESSION</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{course.practicalHours || 18} Hours</p>
                        </div>
                      </div>
                    </div>

                    {course.note && (
                      <div className="bg-slate-950 text-neutral-300 text-[10px] font-medium p-2.5 rounded-xs flex items-center gap-1.5 mb-6">
                        <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center text-[9px] font-bold font-mono">!</span>
                        {course.note}
                      </div>
                    )}
                  </div>

                  {!isEven && (
                    <div className="relative mt-6 mb-6">
                      <img src={course.image || "src/images/7.jpg"} alt={course.title} className="w-full aspect-[4/3] object-cover rounded-xs" />
                      <div className="absolute top-0 left-4 bg-yellow-500 text-slate-950 px-3 py-2 text-center shadow-md font-sans">
                        <p className="text-[8px] uppercase tracking-tighter font-bold opacity-70">FROM</p>
                        <p className="text-lg font-black leading-none">${course.startingPrice}</p>
                        <p className="text-[8px] font-medium mt-0.5 whitespace-nowrap">Per Person</p>
                      </div>
                    </div>
                  )}

                  {/* Built-in Course Booking Activation CTA Trigger Button */}
                  <button 
                    onClick={() => handleOpenBooking(course, "course")}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest py-3 rounded-sm transition mt-2"
                  >
                    BOOK NOW
                  </button>

                </div>
              );
            })}
          </div>
          
          <div className="h-20 hidden md:block" />
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE REGISTRATION MODAL FORM POPUP OVERLAY
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-[99999] p-4">
          <div className="bg-white p-8 rounded-sm w-full max-w-md relative shadow-2xl border border-gray-100 text-left font-sans">
            
            {/* Close Cross Toggle */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-950 text-lg transition font-mono border-none bg-transparent cursor-pointer"
            >
              ✕
            </button>
            
            <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-600 block mb-1">Enlistment Desk</span>
            <h3 className="text-lg font-black text-slate-950 mb-1">Registration Form</h3>
            <p className="text-xs text-gray-400 leading-normal">
              You are applying for enrollment in: <strong className="text-slate-900 font-bold">{selectedItem?.name}</strong> (${selectedItem?.price})
            </p>
            
            <form onSubmit={handleFormSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase text-slate-950 tracking-wider block mb-1.5">Your Full Name</label>
                <input 
                  type="text" placeholder="John Doe" required 
                  className="w-full text-xs p-3 border border-gray-200 rounded-sm focus:outline-none focus:border-yellow-500 bg-slate-50 font-medium"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-950 tracking-wider block mb-1.5">Email Address</label>
                <input 
                  type="email" placeholder="johndoe@example.com" required 
                  className="w-full text-xs p-3 border border-gray-200 rounded-sm focus:outline-none focus:border-yellow-500 bg-slate-50 font-medium"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-950 tracking-wider block mb-1.5">Phone Number</label>
                <input 
                  type="tel" placeholder="+1 (555) 000-0000" required 
                  className="w-full text-xs p-3 border border-gray-200 rounded-sm focus:outline-none focus:border-yellow-500 bg-slate-50 font-medium"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[10px] font-bold uppercase tracking-widest py-3.5 rounded-sm transition mt-2 shadow-md"
              >
                Confirm Admission Enrollment
              </button>
              
              {submitStatus && (
                <p className={`text-center font-bold text-xs mt-2 ${submitStatus.includes('Success') ? 'text-green-600' : 'text-slate-950'}`}>
                  {submitStatus}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}