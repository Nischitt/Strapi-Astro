import React, { useState, useEffect } from 'react';

export default function StudentPortal() {
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Read the token saved in your application when the user logged in
  const token = localStorage.getItem('token'); 

 useEffect(() => {
    // 1. Check every common storage key your login system might be using
    const activeToken = 
      localStorage.getItem('token') || 
      localStorage.getItem('studentToken') || 
      localStorage.getItem('adminToken');

    if (!activeToken) {
      console.warn("No active token detected in localStorage. Booting into Sandbox Mock Mode for testing.");
      
      // Fallback: Instantly display your exact wireframe requirements so you can view your portal
      setStudentData({
        id: "mock-booking-id-123",
        studentName: "Ram Sharma",
        activeCourse: "Beginner Driving",
        progressPercent: 80,
        upcomingLessons: 3,
        attendanceRate: 92,
        certificateStatus: "Pending"
      });
      setLoading(false);
      return;
    }

    // 2. If a real token exists, pull live data from your server.js endpoint
    fetch('http://localhost:5000/api/student/portal-metrics', {
      headers: {
        'Authorization': `Bearer ${activeToken}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load authorized metrics dashboard.");
        return res.json();
      })
      .then((data) => {
        setStudentData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const downloadCertificate = () => {
    if (!studentData || studentData.certificateStatus === 'Pending') {
      alert("Certificate Locked. Ensure processing criteria are cleared on your ledger.");
      return;
    }
    // Accesses your backend PDF Kit stream cleanly using the verified dataset row ID
    window.location.href = `http://localhost:5000/api/bookings/${studentData.id}/certificate`;
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-500 font-mono flex items-center justify-center">Authorizing Secure Session...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 text-rose-400 font-mono flex items-center justify-center p-4">⚠ Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-6 text-sm">
        
        {/* Wireframe Layout Header */}
        <div className="text-center text-slate-700 select-none">
          ---------------------------------
          <h2 className="text-white font-bold text-base my-1 tracking-wide uppercase">
            Welcome {studentData.studentName}
          </h2>
          ---------------------------------
        </div>

        {/* Layout Visual Data Display Grid */}
        <div className="space-y-4 px-1">
          <div className="flex flex-col">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Course</span>
            <span className="text-white font-bold text-base">{studentData.activeCourse}</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Progress</span>
            <span className="text-amber-400 font-black text-base">{studentData.progressPercent}%</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Upcoming Lessons</span>
            <span className="text-white font-bold">{studentData.upcomingLessons}</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-slate-800 pb-1">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Attendance</span>
            <span className="text-emerald-400 font-bold">{studentData.attendanceRate}%</span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Certificate</span>
            <span className={`font-bold ${studentData.certificateStatus === 'Available' ? 'text-amber-400' : 'text-slate-500'}`}>
              {studentData.certificateStatus}
            </span>
          </div>
        </div>

        <div className="text-center text-slate-800 select-none">---------------------------------</div>

        {/* Portal Action Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`p-3 border transition font-bold uppercase cursor-pointer ${
              activeTab === 'bookings' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            [My Bookings]
          </button>

          <button 
            onClick={() => setActiveTab('payments')}
            className={`p-3 border transition font-bold uppercase cursor-pointer ${
              activeTab === 'payments' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            [My Payments]
          </button>

          <button 
            onClick={() => setActiveTab('progress')}
            className={`p-3 border transition font-bold uppercase cursor-pointer ${
              activeTab === 'progress' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            [My Progress]
          </button>

          <button 
            onClick={downloadCertificate}
            className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400 transition font-bold uppercase cursor-pointer"
          >
            [My Certificate]
          </button>
        </div>

        {/* Dynamic Context Panel Console Display */}
        <div className="bg-slate-950 border border-slate-800 p-3 text-xs text-slate-500 min-h-[50px] rounded">
          {activeTab === 'bookings' && <p>› Core driving schedule records synchronized via local environment ledger mappings.</p>}
          {activeTab === 'payments' && <p>› Current payment status ledger entry reads: {studentData.certificateStatus === 'Available' ? 'Paid & Account Approved' : 'Awaiting Balance Signoff'}.</p>}
          {activeTab === 'progress' && <p>› Operations Log: Overall performance tracking indexes rest steady at {studentData.attendanceRate}% verification rate.</p>}
        </div>

        {/* Clear and Log out Session */}
        <div className="text-center pt-2">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="text-[10px] text-slate-600 hover:text-rose-400 transition uppercase font-bold tracking-widest cursor-pointer"
          >
            [ Exit Workspace Portal ]
          </button>
        </div>

      </div>
    </div>
  );
}