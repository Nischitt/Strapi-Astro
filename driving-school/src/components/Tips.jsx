import React, { useState } from "react";

export default function Tips() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Guidelines" },
    { id: "beginner", label: "Beginner Essentials" },
    { id: "defensive", label: "Defensive Driving" },
    { id: "test-prep", label: "Test Preparation" }
  ];

  const tips = [
    {
      id: 1,
      category: "beginner",
      title: "Perfecting Your Seating Position & Mirror Setup",
      difficulty: "Beginner",
      timeToRead: "3 min read",
      summary: "Before turning the key, ensure your posture allows full pedal control and your blind spots are minimized.",
      steps: [
        "Adjust seat height so your hips are at least as high as your knees.",
        "Ensure your wrists can rest comfortably on top of the steering wheel with your back flat against the backrest.",
        "Set side mirrors wide enough so you barely see the trailing edge of your own vehicle frame."
      ]
    },
    {
      id: 2,
      category: "defensive",
      title: "The 3-Second Following Distance Rule",
      difficulty: "Essential",
      timeToRead: "4 min read",
      summary: "Maintaining adequate space cushions gives you precious reaction time if the leading vehicle suddenly brakes.",
      steps: [
        "Pick a fixed object ahead like a signpost, tree, or overhead bridge.",
        "When the car in front passes it, count: One-one-thousand, two-one-thousand, three-one-thousand.",
        "If you pass the same object before finishing your count, back off to increase the gap."
      ]
    },
    {
      id: 3,
      category: "test-prep",
      title: "Mastering the Over-the-Shoulder Blind Spot Check",
      difficulty: "Critical",
      timeToRead: "2 min read",
      summary: "Mirrors show a lot, but they don't show everything. Examiners strictly look for distinct head movements.",
      steps: [
        "Check your interior rearview mirror, then activate your directional signal indicator.",
        "Perform a quick 90-degree chin-to-shoulder glance toward the lane direction you intend to merge into.",
        "Verify clear path clearance before executing any lateral steering displacement."
      ]
    },
    {
      id: 4,
      category: "defensive",
      title: "Managing Adverse Weather & Hydroplaning Risks",
      difficulty: "Advanced",
      timeToRead: "5 min read",
      summary: "Wet roads dramatically decrease friction coefficients. Learn how to maintain traction during sudden heavy downpours.",
      steps: [
        "Reduce travel speeds by at least 5-10 mph below limits when driving on rain-slicked asphalt surface layers.",
        "If the vehicle begins to slide, take your foot off the accelerator pedal immediately—do not stomp the brakes.",
        "Steer smoothly into the direction of the skid to regain mechanical directional alignment control."
      ]
    }
  ];

  const filteredTips = activeCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  return (
    <div className="w-full bg-white font-sans text-gray-700 antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-slate-950">
      
      {/* =========================================================================
          1. HERO BANNER HEADER
          ========================================================================= */}
      <section className="relative h-[240px] bg-neutral-900 flex flex-col items-center justify-center overflow-hidden">
        <img 
          src="src/images/contact-banner.jpg" 
          alt="Driving tips background" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Pro Driving Tips</h1>
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-neutral-400 uppercase">
            <a href="/Hero"><span className="hover:text-yellow-500 cursor-pointer transition">Home</span></a>
            <span className="text-yellow-500 font-normal">»</span>
            <span className="text-white">Tips & Guides</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN GUIDELINES & INTERACTIVE FILTER INTERFACE
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
              Essential Skills for the Modern Roadway
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Curated training briefs directly from our certified expert structural instruction staff members.
            </p>
          </div>

          {/* Filter Toggles Row */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 transition border ${
                  activeCategory === cat.id
                    ? "bg-yellow-500 text-slate-950 border-yellow-500"
                    : "bg-slate-50 text-gray-400 border-gray-200 hover:text-slate-950 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tips Render Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTips.map((tip) => (
              <div 
                key={tip.id} 
                className="border border-gray-200/80 bg-white p-6 shadow-xs rounded-xs flex flex-col justify-between hover:border-gray-300 transition duration-300"
              >
                <div>
                  {/* Badge Row Header */}
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-extrabold text-gray-400 mb-4">
                    <span className="bg-slate-950 text-white px-2 py-0.5 rounded-xs tracking-widest">
                      {tip.difficulty}
                    </span>
                    <span>{tip.timeToRead}</span>
                  </div>

                  {/* Guide Heading title */}
                  <h3 className="text-base font-black text-slate-950 tracking-tight leading-snug mb-3">
                    {tip.title}
                  </h3>

                  {/* Summary Block Quote */}
                  <p className="text-xs text-gray-400 leading-relaxed bg-slate-50 border-l-2 border-yellow-500 p-3 mb-6 italic">
                    {tip.summary}
                  </p>

                  {/* Ordered Step List */}
                  <ol className="space-y-3">
                    {tip.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-slate-700 leading-relaxed items-start">
                        <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Simulated Chevron Action strip indicator link */}
                <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center cursor-pointer group">
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase group-hover:text-yellow-600 transition">
                    »»»»» EXPAND DETAIL BREAKDOWN
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      
     

    </div>
  );
}