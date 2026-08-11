"use client";

import { useState } from "react";

const stats = [
  {
    title: "Total Visitors",
    value: "12,840",
    change: "+12.5%",
    color: "#4f46e5",
  },
  {
    title: "Compatibility Checks",
    value: "3,642",
    change: "+8.2%",
    color: "#7c3aed",
  },
  {
    title: "Active Apps",
    value: "24",
    change: "+4",
    color: "#0891b2",
  },
  {
    title: "Today's Users",
    value: "486",
    change: "+18.4%",
    color: "#059669",
  },
];

const activities = [
  {
    action: "Compatibility check completed",
    user: "Visitor",
    time: "2 minutes ago",
    status: "Completed",
  },
  {
    action: "New app opened",
    user: "Visitor",
    time: "8 minutes ago",
    status: "Active",
  },
  {
    action: "Compatibility Finder used",
    user: "Visitor",
    time: "15 minutes ago",
    status: "Completed",
  },
  {
    action: "New visitor",
    user: "Visitor",
    time: "24 minutes ago",
    status: "New",
  },
];

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Apps", icon: "◈" },
    { name: "Compatibility", icon: "♡" },
    { name: "Analytics", icon: "⌁" },
    { name: "Settings", icon: "⚙" },
  ];

  return (
    <div className="admin-wrapper">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">A</div>
          <div>
            <div className="brand-name">AdminPanel</div>
            <div className="brand-subtitle">Control Center</div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-label">MAIN MENU</div>

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activeMenu === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActiveMenu(item.name);
                setSidebarOpen(false);
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="admin-card">
            <div className="admin-avatar">A</div>
            <div className="admin-info">
              <strong>Administrator</strong>
              <span>Admin account</span>
            </div>
            <button className="logout-button">↪</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        {/* Header */}
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div>
            <h1>{activeMenu}</h1>
            <p>
              {activeMenu === "Dashboard"
                ? "Welcome back. Here's what's happening today."
                : `Manage your ${activeMenu.toLowerCase()} from here.`}
            </p>
          </div>

          <div className="topbar-actions">
            <button className="notification-button">
              ♢
              <span />
            </button>

            <div className="profile">
              <div className="profile-avatar">A</div>
              <div className="profile-text">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        {activeMenu === "Dashboard" && (
          <main className="content">
            {/* Stats */}
            <section className="stats-grid">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>
                  <div className="stat-top">
                    <span className="stat-title">{stat.title}</span>
                    <div
                      className="stat-icon"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <span style={{ color: stat.color }}>↗</span>
                    </div>
                  </div>

                  <div className="stat-value">{stat.value}</div>

                  <div className="stat-change">
                    <span>↑ {stat.change}</span>
                    <small>vs last period</small>
                  </div>
                </div>
              ))}
            </section>

            {/* Charts */}
            <section className="dashboard-grid">
              <div className="panel chart-panel">
                <div className="panel-header">
                  <div>
                    <h2>Website Overview</h2>
                    <p>Visitor activity over the last 7 days</p>
                  </div>

                  <select defaultValue="7">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>

                <div className="chart">
                  <div className="chart-y">
                    <span>2k</span>
                    <span>1.5k</span>
                    <span>1k</span>
                    <span>500</span>
                    <span>0</span>
                  </div>

                  <div className="chart-area">
                    <div className="grid-line" />
                    <div className="grid-line" />
                    <div className="grid-line" />
                    <div className="grid-line" />

                    <svg
                      viewBox="0 0 700 250"
                      preserveAspectRatio="none"
                      className="chart-svg"
                    >
                      <defs>
                        <linearGradient
                          id="areaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#4f46e5"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor="#4f46e5"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0,190 C70,170 80,140 150,155 C220,170 235,95 300,115 C360,135 375,70 430,95 C490,120 505,55 560,80 C615,105 640,45 700,65 L700,250 L0,250 Z"
                        fill="url(#areaGradient)"
                      />

                      <path
                        d="M0,190 C70,170 80,140 150,155 C220,170 235,95 300,115 C360,135 375,70 430,95 C490,120 505,55 560,80 C615,105 640,45 700,65"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="chart-days">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="panel quick-panel">
                <div className="panel-header">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Frequently used controls</p>
                  </div>
                </div>

                <button className="quick-action">
                  <span className="quick-icon purple">+</span>
                  <div>
                    <strong>Add New App</strong>
                    <small>Create a new application</small>
                  </div>
                  <span>›</span>
                </button>

                <button className="quick-action">
                  <span className="quick-icon blue">♡</span>
                  <div>
                    <strong>View Compatibility</strong>
                    <small>Check recent results</small>
                  </div>
                  <span>›</span>
                </button>

                <button className="quick-action">
                  <span className="quick-icon green">↗</span>
                  <div>
                    <strong>View Analytics</strong>
                    <small>Check website performance</small>
                  </div>
                  <span>›</span>
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="panel activity-panel">
              <div className="panel-header">
                <div>
                  <h2>Recent Activity</h2>
                  <p>Latest activity on your website</p>
                </div>

                <button className="view-all">View all →</button>
              </div>

              <div className="activity-table">
                <div className="table-header">
                  <span>ACTIVITY</span>
                  <span>USER</span>
                  <span>TIME</span>
                  <span>STATUS</span>
                </div>

                {activities.map((activity, index) => (
                  <div className="table-row" key={index}>
                    <span className="activity-name">
                      <span className="activity-dot" />
                      {activity.action}
                    </span>

                    <span>{activity.user}</span>

                    <span className="muted">{activity.time}</span>

                    <span>
                      <span
                        className={`status status-${activity.status.toLowerCase()}`}
                      >
                        {activity.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* Placeholder sections */}
        {activeMenu !== "Dashboard" && (
          <main className="content">
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <h2>{activeMenu}</h2>
              <p>
                This section is ready for the next stage of your admin
                system.
              </p>
            </div>
          </main>
        )}
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .admin-wrapper {
          min-height: 100vh;
          background: #f6f7fb;
          color: #172033;
          display: flex;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .sidebar {
          width: 255px;
          background: #ffffff;
          border-right: 1px solid #e8eaf0;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 50;
        }

        .brand {
          height: 82px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 22px;
          border-bottom: 1px solid #f0f1f5;
        }

        .brand-logo {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          font-size: 19px;
          font-weight: 800;
          box-shadow: 0 7px 18px rgba(79, 70, 229, 0.25);
        }

        .brand-name {
          font-size: 16px;
          font-weight: 800;
          color: #182033;
        }

        .brand-subtitle {
          color: #8b93a5;
          font-size: 11px;
          margin-top: 2px;
        }

        .menu-section {
          padding: 25px 14px;
        }

        .menu-label {
          font-size: 10px;
          font-weight: 800;
          color: #a0a6b4;
          letter-spacing: 1.2px;
          padding: 0 12px 10px;
        }

        .menu-item {
          width: 100%;
          border: 0;
          background: transparent;
          color: #6d7587;
          padding: 12px 13px;
          margin-bottom: 4px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: 0.2s;
        }

        .menu-item:hover {
          background: #f5f5ff;
          color: #4f46e5;
        }

        .menu-item.active {
          color: #4f46e5;
          background: #eeefff;
        }

        .menu-icon {
          width: 22px;
          font-size: 18px;
          text-align: center;
        }

        .sidebar-bottom {
          margin-top: auto;
          padding: 15px;
          border-top: 1px solid #f0f1f5;
        }

        .admin-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px;
          border-radius: 11px;
          background: #f7f8fb;
        }

        .admin-avatar,
        .profile-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff;
          font-weight: 700;
        }

        .admin-avatar {
          width: 34px;
          height: 34px;
          font-size: 13px;
        }

        .admin-info {
          flex: 1;
          min-width: 0;
        }

        .admin-info strong,
        .admin-info span {
          display: block;
        }

        .admin-info strong {
          font-size: 11px;
        }

        .admin-info span {
          font-size: 9px;
          color: #9098a8;
          margin-top: 2px;
        }

        .logout-button {
          border: 0;
          background: transparent;
          color: #9ca3b2;
          cursor: pointer;
          font-size: 18px;
        }

        .main-area {
          width: calc(100% - 255px);
          margin-left: 255px;
          min-height: 100vh;
        }

        .topbar {
          min-height: 82px;
          background: rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid #e8eaf0;
          display: flex;
          align-items: center;
          padding: 16px 34px;
          gap: 20px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .topbar h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .topbar p {
          margin: 5px 0 0;
          color: #8b93a5;
          font-size: 12px;
        }

        .topbar-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .notification-button {
          width: 36px;
          height: 36px;
          border: 1px solid #e8eaf0;
          background: #fff;
          border-radius: 10px;
          color: #5e6678;
          font-size: 18px;
          position: relative;
          cursor: pointer;
        }

        .notification-button span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ef4444;
          position: absolute;
          right: 7px;
          top: 6px;
          border: 1px solid white;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          font-size: 13px;
        }

        .profile-text strong,
        .profile-text small {
          display: block;
        }

        .profile-text strong {
          font-size: 12px;
        }

        .profile-text small {
          color: #9299a8;
          font-size: 10px;
          margin-top: 2px;
        }

        .content {
          padding: 30px 34px 50px;
          max-width: 1500px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 17px;
        }

        .stat-card,
        .panel {
          background: #fff;
          border: 1px solid #e9ebf1;
          border-radius: 15px;
          box-shadow: 0 3px 15px rgba(26, 35, 58, 0.025);
        }

        .stat-card {
          padding: 20px;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-title {
          color: #737b8d;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 17px;
        }

        .stat-value {
          font-size: 27px;
          font-weight: 800;
          margin-top: 14px;
          letter-spacing: -0.7px;
        }

        .stat-change {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .stat-change span {
          color: #059669;
          font-size: 10px;
          font-weight: 700;
        }

        .stat-change small {
          color: #a0a6b4;
          font-size: 9px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
          gap: 18px;
          margin-top: 18px;
        }

        .panel {
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 21px;
          border-bottom: 1px solid #f0f1f5;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
        }

        .panel-header p {
          margin: 5px 0 0;
          font-size: 10px;
          color: #969dac;
        }

        .panel-header select {
          border: 1px solid #e5e7ed;
          background: white;
          border-radius: 7px;
          padding: 7px 10px;
          color: #60697a;
          font-size: 10px;
          outline: none;
        }

        .chart {
          height: 315px;
          display: flex;
          padding: 25px 20px 20px 15px;
        }

        .chart-y {
          width: 34px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 24px;
          color: #a0a7b5;
          font-size: 9px;
          text-align: right;
        }

        .chart-area {
          position: relative;
          flex: 1;
          height: 100%;
          margin-left: 10px;
        }

        .grid-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: #f0f1f5;
        }

        .grid-line:nth-child(1) {
          top: 0;
        }

        .grid-line:nth-child(2) {
          top: 25%;
        }

        .grid-line:nth-child(3) {
          top: 50%;
        }

        .grid-line:nth-child(4) {
          top: 75%;
        }

        .chart-svg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: calc(100% - 25px);
        }

        .chart-days {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          color: #9aa1af;
          font-size: 9px;
        }

        .quick-panel {
          min-height: 315px;
        }

        .quick-action {
          width: calc(100% - 30px);
          margin: 0 15px 10px;
          border: 1px solid #edf0f4;
          background: white;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
          text-align: left;
          transition: 0.2s;
        }

        .quick-action:hover {
          border-color: #dcdcff;
          background: #fafaff;
          transform: translateY(-1px);
        }

        .quick-action > div {
          flex: 1;
        }

        .quick-action strong,
        .quick-action small {
          display: block;
        }

        .quick-action strong {
          font-size: 11px;
        }

        .quick-action small {
          color: #969dac;
          font-size: 9px;
          margin-top: 3px;
        }

        .quick-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: 16px;
          font-weight: 700;
        }

        .purple {
          background: #f0efff;
          color: #4f46e5;
        }

        .blue {
          background: #eaf8ff;
          color: #0891b2;
        }

        .green {
          background: #e9fbf4;
          color: #059669;
        }

        .quick-action > span:last-child {
          color: #a0a7b5;
          font-size: 20px;
        }

        .activity-panel {
          margin-top: 18px;
        }

        .view-all {
          border: 0;
          background: transparent;
          color: #4f46e5;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .activity-table {
          width: 100%;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 0.8fr;
          align-items: center;
          padding: 13px 21px;
          gap: 15px;
        }

        .table-header {
          background: #fafbfc;
          color: #a0a6b3;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .table-row {
          border-top: 1px solid #f0f1f5;
          color: #626b7d;
          font-size: 10px;
        }

        .activity-name {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #333c4f;
          font-weight: 600;
        }

        .activity-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .muted {
          color: #9aa1af;
        }

        .status {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 700;
        }

        .status-completed {
          background: #e9fbf3;
          color: #059669;
        }

        .status-active {
          background: #edf2ff;
          color: #4f46e5;
        }

        .status-new {
          background: #fff7e6;
          color: #d97706;
        }

        .empty-state {
          background: white;
          border: 1px solid #e9ebf1;
          border-radius: 15px;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eeefff;
          color: #4f46e5;
          font-size: 25px;
          margin-bottom: 15px;
        }

        .empty-state h2 {
          margin: 0;
          font-size: 20px;
        }

        .empty-state p {
          color: #8b93a5;
          font-size: 12px;
        }

        .mobile-menu {
          display: none;
          border: 0;
          background: #f1f2f7;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          font-size: 17px;
        }

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }

          .sidebar.sidebar-open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 40;
          }

          .main-area {
            width: 100%;
            margin-left: 0;
          }

          .mobile-menu {
            display: block;
          }

          .profile-text {
            display: none;
          }

          .topbar {
            padding: 14px 18px;
          }

          .content {
            padding: 20px 15px 40px;
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .topbar h1 {
            font-size: 18px;
          }

          .topbar p {
            font-size: 10px;
          }

          .notification-button {
            display: none;
          }

          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr;
            gap: 7px;
            padding: 15px;
          }

          .table-row > span:not(.activity-name) {
            padding-left: 16px;
          }

          .chart {
            height: 260px;
          }
        }
      `}</style>
    </div>
  );
}