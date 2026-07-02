import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function UserProfile() {
  const token = localStorage.getItem('studentToken') || localStorage.getItem('token');
  const studentEmail = localStorage.getItem('studentEmail') || "student@udrive.com";

  const [myBooking, setMyBooking] = useState(null); // single active booking, or null
  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const getToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('studentToken') ||
    localStorage.getItem('adminToken');

    

  useEffect(() => {
    const activeToken = getToken();

    if (!activeToken) {
      window.location.href = '/loginsignup';
      return;
    }

    setLoading(true);

    const fetchOptions = {
      headers: {
        'Authorization': `Bearer ${activeToken}`,
        'Content-Type': 'application/json'
      }
    };

    Promise.all([
      fetch(`${API_URL}/api/bookings`, fetchOptions).then(res => {
        if (!res.ok) throw new Error(`Bookings failed: ${res.status}`);
        return res.json();
      }),
      fetch(`${API_URL}/api/packages`, fetchOptions).then(res => {
        if (!res.ok) throw new Error(`Packages failed: ${res.status}`);
        return res.json();
      }),
      fetch(`${API_URL}/api/courses`, fetchOptions).then(res => {
        if (!res.ok) throw new Error(`Courses failed: ${res.status}`);
        return res.json();
      })
    ])
      .then(([bookingsData, packagesData, coursesData]) => {
        const userBookings = Array.isArray(bookingsData) && studentEmail
          ? bookingsData.filter(b => b.studentEmail?.toLowerCase() === studentEmail.toLowerCase())
          : [];

        // Only one booking is ever "active" per the one-at-a-time rule.
        // If multiple exist historically, show the most recent.
        const sorted = [...userBookings].sort(
          (a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0)
        );
        setMyBooking(sorted[0] || null);

        setAvailablePackages(packagesData);
        setAvailableCourses(coursesData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile details:", err);
        setLoading(false);
      });
  }, []);

  // ----- Booking -----
  const handleInstantBook = async (item, type) => {
    if (myBooking && (myBooking.progressPercent ?? 0) < 100) {
      setMessage({
        text: "You already have an active enrollment. Complete it before booking another course or package.",
        type: 'error'
      });
      return;
    }

    const confirmBooking = window.confirm(`Would you like to register an application for: ${item.name || item.title}?`);
    if (!confirmBooking) return;

    const bookingPayload = {
      studentName: studentEmail.split('@')[0],
      studentEmail: studentEmail,
      studentPhone: "98XXXXXXXX",
      itemType: type,
      itemName: item.name || item.title,
      itemPrice: item.price || item.startingPrice || 0,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    };

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();

      if (response.ok) {
        setMyBooking({ _id: result.id || result._id || Date.now().toString(), ...bookingPayload });
        setMessage({ text: `Successfully applied for ${item.name || item.title}!`, type: 'success' });
        setActiveTab('overview');
      } else {
        throw new Error(result.error || 'Booking transaction rejected.');
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  // ----- Payment -----
  const handleWalletPayment = async (bookingId, itemName, amount) => {
    const useEsewa = window.confirm(
      `--- uDrive Digital Checkout Gateway ---\n\n` +
      `Item: ${itemName}\n` +
      `Total Amount: Rs. ${amount}\n\n` +
      `Click [OK] to pay via eSewa\n` +
      `Click [Cancel] to pay via Khalti`
    );

    const chosenGateway = useEsewa ? "eSewa" : "Khalti";

    const walletId = window.prompt(`Enter your 10-digit ${chosenGateway} ID/Mobile Number:`);
    if (!walletId) return;

    const walletPin = window.prompt(`Enter your 4-digit ${chosenGateway} M-PIN:`);
    if (!walletPin) return;

    setLoading(true);
    setMessage({ text: `Connecting to secure ${chosenGateway} nodes... Please do not close this window.`, type: 'success' });

    setTimeout(async () => {
      const fakeTxnId = "TXN-" + Math.floor(Math.random() * 10000000).toString();

      try {
        const response = await fetch(`${API_URL}/api/bookings/${bookingId}/pay`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: fakeTxnId,
            paymentMethod: chosenGateway
          })
        });

        if (response.ok) {
          setMyBooking(prev => prev ? {
            ...prev,
            paymentStatus: 'Paid',
            paymentMethod: chosenGateway,
            transactionId: fakeTxnId,
            status: 'Approved'
          } : prev);
          setMessage({ text: `Payment Successful via ${chosenGateway}! Reference: ${fakeTxnId}`, type: 'success' });
        } else {
          throw new Error("Payment node verification failed.");
        }
      } catch (error) {
        setMessage({ text: error.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  // ----- Attendance check-in -----
  const handleDailyCheckIn = async () => {
      if (!myBooking) return;
  const activeToken = getToken();
  const bookingId = myBooking._id || myBooking.id;
  console.log("DEBUG - myBooking:", myBooking);
  console.log("DEBUG - bookingId being sent:", bookingId);

    try {
      const response = await fetch(`${API_URL}/api/student/check-in`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Check-in operation failed.");
      }

      setMessage({ text: "✨ Attendance recorded successfully! Progress metrics updated.", type: 'success' });

      // refresh metrics for this booking
      const metricsRes = await fetch(`${API_URL}/api/student/portal-metrics?bookingId=${bookingId}`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (metricsRes.ok) {
        const metrics = await metricsRes.json();
        setMyBooking(prev => prev ? { ...prev, ...metrics } : prev);
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const handleDownloadCertificate = () => {
    if (!myBooking) return;
    const bookingId = myBooking._id || myBooking.id;
    if ((myBooking.progressPercent ?? 0) < 100 || myBooking.paymentStatus !== 'Paid') {
      setMessage({ text: "Certificate locked. Finish all sessions and complete payment first.", type: 'error' });
      return;
    }
    window.location.href = `${API_URL}/api/bookings/${bookingId}/certificate`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Syncing account records...</p>
      </div>
    );
  }

  const hasActiveEnrollment = myBooking && (myBooking.progressPercent ?? 0) < 100;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-4 md:px-8 font-sans antialiased text-slate-600">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xl shadow-md">
              {studentEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[9px] font-black tracking-wider text-amber-700 bg-amber-400/10 px-2.5 py-0.5 rounded-full uppercase">
                Student Member
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1 tracking-tight">{studentEmail}</h2>
              <p className="text-slate-400 text-xs mt-0.5">Manage your enrollment, attendance, and payments.</p>
            </div>
          </div>

          <button
            onClick={() => { localStorage.clear(); window.location.href = '/loginsignup'; }}
            className="w-full md:w-auto bg-slate-100 text-slate-700 px-5 py-3 rounded-xl text-xs font-bold hover:bg-slate-200/80 active:scale-95 transition cursor-pointer"
          >
            Terminate Session
          </button>
        </div>

        {/* Banner */}
        {message.text && (
          <div className={`p-4 rounded-xl font-semibold text-xs border transition-all duration-300 flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
          }`}>
            <span className="font-mono text-base">›</span> {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wide rounded-t-lg cursor-pointer transition ${
              activeTab === 'overview' ? 'bg-white border border-slate-200 border-b-white text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            My Enrollment
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wide rounded-t-lg cursor-pointer transition ${
              activeTab === 'browse' ? 'bg-white border border-slate-200 border-b-white text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Browse Courses &amp; Packages
          </button>
        </div>

        {/* ===== OVERVIEW TAB: enrollment status + check-in + certificate ===== */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8">
            {!myBooking ? (
              <div className="text-center py-12">
                <div className="text-slate-300 text-3xl mb-2">🚗</div>
                <p className="text-slate-400 text-xs italic mb-4">You're not enrolled in any course or package yet.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-xl text-[10px] uppercase tracking-wider transition cursor-pointer"
                >
                  Browse Courses &amp; Packages
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Currently Enrolled In</span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{myBooking.itemName}</h3>
                  </div>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-bold ${
                    (myBooking.status === 'Approved' || myBooking.status === 'Success!')
                      ? 'bg-emerald-500/10 text-emerald-700'
                      : 'bg-amber-500/10 text-amber-700'
                  }`}>
                    ● {myBooking.status || 'Pending Verification'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Progress</span>
                    <span className="text-xl font-black text-amber-500">{myBooking.progressPercent ?? 0}%</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Remaining Lessons</span>
                    <span className="text-xl font-black text-slate-900">{myBooking.remainingSessions ?? myBooking.upcomingLessons ?? '—'}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Payment</span>
                    <span className={`text-sm font-black ${myBooking.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {myBooking.paymentStatus || 'Unpaid'}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Certificate</span>
                    <span className={`text-sm font-black ${(myBooking.progressPercent ?? 0) >= 100 && myBooking.paymentStatus === 'Paid' ? 'text-amber-500' : 'text-slate-400'}`}>
                      {(myBooking.progressPercent ?? 0) >= 100 && myBooking.paymentStatus === 'Paid' ? 'Available' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleDailyCheckIn}
                    disabled={(myBooking.progressPercent ?? 0) >= 100}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest p-3.5 rounded-xl transition shadow-sm cursor-pointer text-center"
                  >
                    ✔ Check-In Today's Attendance
                  </button>

                  {myBooking.paymentStatus !== 'Paid' ? (
                    <button
                      onClick={() => handleWalletPayment(myBooking._id || myBooking.id, myBooking.itemName, myBooking.itemPrice)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest p-3.5 rounded-xl transition shadow-sm cursor-pointer text-center"
                    >
                      Complete Payment
                    </button>
                  ) : (
                    <button
                      onClick={handleDownloadCertificate}
                      className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-widest p-3.5 rounded-xl transition shadow-sm cursor-pointer text-center"
                    >
                      🎓 Download Certificate
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== BROWSE TAB: packages + courses ===== */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {hasActiveEnrollment && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold p-4 rounded-xl">
                You already have an active enrollment ("{myBooking.itemName}"). Complete it before booking another course or package.
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-px bg-slate-200 flex-1" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Practical Field Packages</h4>
                <span className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availablePackages.map((pkg) => (
                  <div key={pkg.id || pkg._id} className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-md transition relative overflow-hidden">
                    {pkg.isPopular && (
                      <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                        Popular Track
                      </span>
                    )}
                    <div>
                      <h5 className="font-black text-slate-900 text-base tracking-tight">{pkg.name}</h5>
                      <p className="text-slate-400 text-[11px] italic mt-0.5">{pkg.tagline || 'Defensive roadmap training module'}</p>

                      <div className="mt-4 flex items-baseline gap-1 text-slate-900">
                        <span className="text-xl font-black tracking-tight">Rs. {pkg.price}</span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">/ Slot</span>
                      </div>

                      <div className="mt-5 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
                        <div className="flex justify-between"><span className="text-slate-400">Fleet Class:</span> <span className="font-bold text-slate-800">{pkg.carType || 'Standard Transmission'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Duration:</span> <span className="font-bold text-slate-800">{pkg.durationDays || 30} Days ({pkg.hoursPerDay || 1} Hr/Day)</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Splits:</span> <span className="font-bold text-slate-800">{pkg.theoryLessons || 0} Theory | {pkg.practicalLessons || 0} Road</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Logistics:</span> <span className="font-bold text-slate-800 text-[11px]">{pkg.freePickup ? '✓ Complimentary Pickup' : 'Station Intake'}</span></div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstantBook(pkg, 'package')}
                      disabled={hasActiveEnrollment}
                      className="w-full mt-6 bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-wider py-3.5 rounded-xl hover:bg-slate-800 active:scale-[0.99] transition cursor-pointer"
                    >
                      Instantly Request Package
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="h-px bg-slate-200 flex-1" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Licensing Core</h4>
                <span className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.map((course) => (
                  <div key={course.id || course._id} className="bg-white rounded-2xl border border-slate-200/60 p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition">
                    <div className="w-full sm:w-32 h-28 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800 relative">
                      <img
                        src={course.image || 'https://via.placeholder.com/300'}
                        alt={course.title}
                        onError={(e) => { e.target.src = 'https://placehold.co/150x100?text=Udrive+Academy'; }}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-40" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h5 className="font-black text-slate-900 text-base tracking-tight truncate">{course.title}</h5>
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">{course.description}</p>

                        <div className="mt-3 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">📘 Theory: {course.theoryHours || 0} Hrs</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">🚘 Road: {course.practicalHours || 0} Hrs</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-3.5">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-bold block tracking-wider">Tuition Base</span>
                          <span className="font-black text-slate-900 text-base tracking-tight">Rs. {course.startingPrice}</span>
                        </div>
                        <button
                          onClick={() => handleInstantBook(course, 'course')}
                          disabled={hasActiveEnrollment}
                          className="bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 cursor-pointer"
                        >
                          Enroll Track
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
