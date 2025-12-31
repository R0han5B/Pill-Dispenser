import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import ActivityFilters from "./components/ActivityFilters";
import ActivityFeed from "./components/ActivityFeed";
import ActivityStats from "./components/ActivityStats";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { supabase } from "../../lib/supabaseClient";

const ActivityLog = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({
    totalEvents: 0,
    medicationsDispensed: 0,
    missedDoses: 0,
    lowStockAlerts: 0,
  });

  // Fetch activity logs from Supabase
  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("timestamp", { ascending: false });

    if (!error && data) {
      setActivities(data);
      setFilteredActivities(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  // Calculate summary stats
  const calculateStats = (data) => {
    const stats = {
      totalEvents: data.length,
      medicationsDispensed: data.filter((a) => a.eventType === "medication-dispensed").length,
      missedDoses: data.filter((a) => a.eventType === "medication-missed").length,
      lowStockAlerts: data.filter((a) => a.eventType === "low-stock-alert").length,
    };
    setActivityStats(stats);
  };

  // Live updates from Supabase Realtime
  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel("activity_log_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_log" },
        (payload) => {
          fetchActivities(); // Refresh whenever a new log entry is added/updated/deleted
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sidebar & UI toggles
  const handleSidebarToggle = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  // Filter logic (search, eventType, status, etc.)
  const handleFilterChange = (filters) => {
    let filtered = [...activities];

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(query) ||
          a.medicationName?.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query)
      );
    }

    if (filters?.eventType) {
      filtered = filtered.filter((a) => a.eventType === filters.eventType);
    }

    if (filters?.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }

    setFilteredActivities(filtered);
  };

  const handleExportReport = () => {
    const csvContent = [
      ["Timestamp", "Event Type", "Patient", "Medication", "Status", "Description"],
      ...filteredActivities.map((a) => [
        new Date(a.timestamp).toLocaleString(),
        a.eventType,
        a.patientName || "",
        a.medicationName || "",
        a.status,
        a.description,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={mobileMenuOpen}
        onToggle={handleMobileMenuToggle}
        alertCounts={{ schedules: 0, activity: activities.length }}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-280"}`}>
        <Header
          user={{ name: "Active User" }}
          onLogout={handleLogout}
          isMobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Activity Log</h1>
                <p className="text-muted-foreground">
                  Track medication events, system alerts, and real-time device updates.
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate("/medication-schedules")}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  View Schedules
                </Button>

                <Button
                  variant="default"
                  onClick={() => navigate("/patient-management")}
                  iconName="Users"
                  iconPosition="left"
                >
                  Manage Patients
                </Button>
              </div>
            </div>

            <ActivityStats stats={activityStats} />

            <ActivityFilters
              onFilterChange={handleFilterChange}
              onExport={handleExportReport}
              totalActivities={filteredActivities.length}
            />

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Recent Activities</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredActivities.length} total records
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchActivities}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Refresh
                </Button>
              </div>

              <ActivityFeed activities={filteredActivities} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityLog;
