import React from "react";

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: "Standard Driving Course",
      price: "64",
      image: "/images/6.jpg",
      theory: "04 Hours",
      practical: "18 Hours",
      desc: "Develop foundational roadway mastery and master parking and lane configuration rules under professional, patient guidance.",
    },
    {
      id: 2,
      title: "Extended Driving Course",
      price: "84",
      image: "/images/7.jpg",
      theory: "06 Hours",
      practical: "26 Hours",
      desc: "Dive deep into advanced defensive highway mechanics, intricate adverse weather driving patterns, and comprehensive traffic logic.",
    },
    {
      id: 3,
      title: "Commercial Truck License",
      price: "199",
      image: "/images/25.jpg",
      theory: "12 Hours",
      practical: "40 Hours",
      desc: "Complete professional logistics vehicle certification training containing advanced structural air brake systems and safety control frameworks.",
    },
    {
      id: 4,
      title: "Defensive Road Safety Guide",
      price: "45",
      image: "/images/24.jpg",
      theory: "08 Hours",
      practical: "02 Hours",
      desc: "A specialized structural awareness program explicitly built to minimize vehicle friction risks, predict hazards, and protect response habits.",
    },
  ];

  return (
    <div className="w-full bg-[#F0F8FF] font-sans text-slate-700 antialiased overflow-x-hidden selection:bg-yellow-200 selection:text-slate-900">
      
      {/* HERO BANNER HEADER */}
      <section className="relative h-[320px] bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 flex flex-col items-center justify-center overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[url('/images/contact-banner.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay scale-105" />
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Header Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <span className="text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 px-4 py-1.5 rounded-full uppercase mb-4 inline-block">
            Academy Packages
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Our Colorful Driving Courses
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-200">
            <a href="/hero" className="hover:text-yellow-300 transition-colors duration-150">Home</a>
            <span className="text-slate-300 select-none">/</span>
            <span className="text-slate-200">Courses</span>
          </div>
        </div>
      </section>

      {/* COURSES LISTING SECTION */}
      <section className="py-24 px-4 md:px-6 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-violet-700 mb-4">
            Pick a Colorful Course to Match Your Skill
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            All curriculum packages are infused with vibrant colors, ensuring an engaging learning experience.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl border border-gray-300 p-6 flex flex-col justify-between transition-transform duration-300 shadow-lg hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br from-pink-100 via-violet-100 to-green-100"
            >
              {/* Image Container with overlay */}
              <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 aspect-[16/10] shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20 shadow-lg hover:scale-105 transition-transform duration-200">
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-1">FROM</p>
                  <p className="text-2xl font-extrabold leading-none mb-1">${course.price}</p>
                  <p className="text-[9px] font-medium">All Inclusive</p>
                </div>
              </div>

              {/* Course Info */}
              <div>
                <span className="text-xs font-semibold tracking-wider text-pink-600 uppercase block mb-2">
                  DRIVING ACADEMY
                </span>
                <h3 className="text-2xl font-bold text-violet-900 mb-3 hover:text-pink-600 transition-colors duration-200">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{course.desc}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 border-t border-b py-4 my-4 border-gray-300">
                  {/* Theory Hours */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm hover:shadow-lg transition-shadow duration-200">
                      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">THEORY LESSONS</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{course.theory}</p>
                    </div>
                  </div>
                  {/* Practical Hours */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shadow-sm hover:shadow-lg transition-shadow duration-200">
                      <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PRACTICAL TRACK</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{course.practical}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Note */}
              <div className="bg-yellow-50/70 text-yellow-800 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2 border border-yellow-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">!</span>
                <span className="opacity-90">Excludes dynamic state registration highway validation metrics.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Split Line */}
      <div className="w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-green-400 opacity-90" />
    </div>
  );
}