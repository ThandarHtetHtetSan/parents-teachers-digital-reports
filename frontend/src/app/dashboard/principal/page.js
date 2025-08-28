'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrincipalDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_students: 0,
      total_teachers: 0,
      total_classes: 0,
      average_attendance: 0,
      average_grade: 'N/A'
    },
    recent_reports: [],
    recent_announcements: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/principal/dashboard');
        const data = await response.json();
        
        if (data.success) {
          setDashboardData(data.data);
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Principal Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => router.push('/dashboard/principal/reports')}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-left"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-2">Publish Reports</h3>
          <p className="text-sm text-gray-600">Generate and publish class reports for grades and attendance</p>
        </button>
        <button 
          onClick={() => router.push('/dashboard/principal/announcements')}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-left"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-2">Manage Announcements</h3>
          <p className="text-sm text-gray-600">Create and manage school-wide announcements</p>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-semibold text-sky-600">{dashboardData.stats.total_students}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Teachers</p>
          <p className="text-2xl font-semibold text-sky-600">{dashboardData.stats.total_teachers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Classes</p>
          <p className="text-2xl font-semibold text-sky-600">{dashboardData.stats.total_classes}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Average Attendance</p>
          <p className="text-2xl font-semibold text-sky-600">{dashboardData.stats.average_attendance}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Average Grade</p>
          <p className="text-2xl font-semibold text-sky-600">{dashboardData.stats.average_grade}</p>
        </div>
      </div>

      {/* Recent Reports and Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Recent Reports</h2>
            <button 
              onClick={() => router.push('/dashboard/principal/reports')}
              className="text-sm text-sky-600 hover:text-sky-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recent_reports.length > 0 ? (
              dashboardData.recent_reports.map((report) => (
                <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{report.class_name}</p>
                    <p className="text-sm text-gray-600">{report.exam_name} Report</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(report.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent reports</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Recent Announcements</h2>
            <button 
              onClick={() => router.push('/dashboard/principal/announcements')}
              className="text-sm text-sky-600 hover:text-sky-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recent_announcements.length > 0 ? (
              dashboardData.recent_announcements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent announcements</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
