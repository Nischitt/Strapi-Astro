import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 Fetch live backend team data on component mount
  useEffect(() => {
    fetch(`${API_URL}/api/team`)
      .then((res) => res.json())
      .then((data) => {
        const formattedMembers = data.map((member) => {
          const socialsArray = [];
          if (member.fbUrl) socialsArray.push({ type: 'facebook', url: member.fbUrl });
          if (member.twUrl) socialsArray.push({ type: 'twitter', url: member.twUrl });
          if (member.lnUrl) socialsArray.push({ type: 'linkedin', url: member.lnUrl });
          
          return {
            id: member._id || member.id,
            name: member.name,
            role: member.title || "Driving Instructor", 
            image: member.image,
            bio: member.bio || "Professional driving tutor dedicated to safety and confidence on the road.",
            socials: socialsArray,
          };
        });

        setTeamMembers(formattedMembers);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Roster fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'; 
  };

  const getSocialIcon = (type) => {
    switch (type) {
      case 'facebook':
        return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>;
      case 'twitter':
        return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
      case 'linkedin':
        return <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-amber-200 selection:text-slate-900">
      
      {/* HERO BANNER HEADER */}
      <section className="relative h-[380px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col items-center justify-center overflow-hidden">
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay scale-105" />
        
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-20 text-center px-6 max-w-4xl">
          <span className="text-xs font-semibold tracking-wider text-amber-400 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 px-4 py-1.5 rounded-full inline-block uppercase">
            Meet Our Experts
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-5 mb-4 leading-tight">
            Behind The Wheel
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
            <span className="hover:text-amber-400 cursor-pointer transition-colors duration-150">Home</span>
            <span className="text-slate-600 select-none">/</span>
            <span className="text-slate-200">Instructors</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* Section Title Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-slate-200 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Certified Safety Personnel
            </h2>
            <p className="text-slate-500 text-base md:text-lg mt-3 max-w-2xl font-normal leading-relaxed">
              Licensed veteran professionals specialized in defensive driving techniques, adaptive safety education, and comprehensive road confidence.
            </p>
          </div>
          <div className="self-start md:self-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
              System Online
            </span>
          </div>
        </div>

        {/* ⏳ Skeleton Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full aspect-[4/5] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-6 bg-slate-200 rounded w-2/3" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 🗃️ REFINED INSTRUCTOR CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="group bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="text-left">
                  {/* Modern Image Container Layout */}
                  <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden mb-5">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={handleImageError} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Role Tag badge */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold tracking-wide text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                      {member.role}
                    </span>
                  </div>
                  
                  {/* Instructor Title Name */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 transition-colors duration-200 group-hover:text-blue-700">
                    {member.name}
                  </h3>
                  
                  {/* Bio Paragraph */}
                  <p className="text-sm text-slate-500 leading-relaxed font-normal mb-6 min-h-[72px]">
                    {member.bio}
                  </p>
                </div>

                {/* Social Connect Layer Footer */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Connect
                  </span>
                  
                  <div className="flex gap-2">
                    {member.socials.length > 0 ? (
                      member.socials.map((social, i) => (
                        <a 
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 bg-slate-50 hover:bg-amber-500 text-slate-600 hover:text-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 border border-slate-200/60 shadow-sm"
                          title={`Open ${member.name}'s ${social.type}`}
                        >
                          {getSocialIcon(social.type)}
                        </a>
                      ))
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        In-Person Only
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* CLEAN POLISHED FOOTER ACCENT BAR */}
      <div className="w-full h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500 opacity-90" />

    </div>
  );
}