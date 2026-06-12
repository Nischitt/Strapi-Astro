import React from "react";
import { useGetList } from "react-admin"; // 💡 Import the data hook from react-admin

export function Dashboard() {
  // 1. Fetch live data from your react-admin resources
  const { total: bookingsCount, isLoading: loadingBookings } = useGetList("bookings", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: coursesCount, isLoading: loadingCourses } = useGetList("courses", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: leadsCount, isLoading: loadingLeads } = useGetList("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const cardStyle = {
    background: "rgba(22,25,37,0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  // 2. Set up stat configurations with live fallback values
  const statsData = [
    {
      title: "Total Bookings",
      value: loadingBookings ? "..." : String(bookingsCount ?? 0),
      growth: "+24%",
      color: "#10b981",
      icon: "📈",
    },
    {
      title: "Active Courses",
      value: loadingCourses ? "..." : String(coursesCount ?? 0),
      growth: "+14%",
      color: "#38bdf8",
      icon: "🎓",
    },
    {
      title: "Pending Leads",
      value: loadingLeads ? "..." : String(leadsCount ?? 0),
      growth: "-35%",
      color: "#ef4444",
      icon: "⏳",
    },
    {
      title: "Revenue",
      value: loadingBookings ? "..." : `Rs ${(bookingsCount ?? 0) * 5000}`, // Multiplied by your course package rate
      growth: "+18%",
      color: "#f59e0b",
      icon: "💰",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "radial-gradient(circle at top left, rgba(245,158,11,.12), transparent 35%), radial-gradient(circle at bottom right, rgba(56,189,248,.12), transparent 35%), #0f111a",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#fff",
              fontSize: "32px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            🚗 Dashboard Overview
          </h1>
          <p
            style={{
              color: "#94a3b8",
              marginTop: "8px",
              fontSize: "14px",
            }}
          >
            Monitor bookings, courses, leads and operational performance.
          </p>
        </div>

        <button
          style={{
            background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
            border: "none",
            color: "#111827",
            padding: "12px 20px",
            borderRadius: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + New Booking
        </button>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {statsData.map((item) => (
          <div key={item.title} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                {item.title}
              </span>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
            </div>

            <h2
              style={{
                color: "#fff",
                fontSize: "36px",
                margin: "0 0 10px",
                fontWeight: 800,
              }}
            >
              {item.value}
            </h2>

            <span
              style={{
                color: item.color,
                background: `${item.color}20`,
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {item.growth}
            </span>
          </div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        {/* Chart Area */}
        <div style={cardStyle}>
          <h3
            style={{
              color: "#fff",
              marginBottom: "20px",
              fontSize: "18px",
            }}
          >
            📊 Booking Performance
          </h3>

          <div
            style={{
              height: "320px",
              borderRadius: "16px",
              background:
                "linear-gradient(180deg, rgba(245,158,11,.15), rgba(245,158,11,.02))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              border: "1px dashed rgba(255,255,255,.08)",
            }}
          >
            Chart Area
          </div>
        </div>

        {/* Activity Feed */}
        <div style={cardStyle}>
          <h3
            style={{
              color: "#fff",
              marginBottom: "20px",
              fontSize: "18px",
                }}
          >
            🔔 Recent Activity
          </h3>

          {[
            "New booking received",
            "Premium package purchased",
            "Course updated",
            "Lead submitted",
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#0f111a",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {activity}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "4px",
                }}
              >
                {index + 1} hour ago
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}