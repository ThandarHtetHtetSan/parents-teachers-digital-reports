'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_users: 0,
      total_students: 0,
      total_teachers: 0,
      total_parents: 0,
      total_principals: 0
    },
    recent_users: [],
    recent_students: []
  });

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDashboardData(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
          onClick={() => router.push('/dashboard/admin/users')}
          className="p-5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Manage Users</h3>
          <p className="text-sm text-gray-600">Add, edit, and manage all users in the system</p>
        </button>
        <button 
          onClick={() => router.push('/dashboard/admin/students')}
          className="p-5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Manage Students</h3>
          <p className="text-sm text-gray-600">Add, edit, and manage all students and their classes</p>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-sky-700">{dashboardData.stats.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-sky-700">{dashboardData.stats.total_students}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Teachers</p>
          <p className="text-2xl font-bold text-sky-700">{dashboardData.stats.total_teachers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Parents</p>
          <p className="text-2xl font-bold text-sky-700">{dashboardData.stats.total_parents}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Principals</p>
          <p className="text-2xl font-bold text-sky-700">{dashboardData.stats.total_principals}</p>
        </div>
      </div>

      {/* Recent Users and Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
            <button 
              onClick={() => router.push('/dashboard/admin/users')}
              className="text-sm text-sky-700 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recent_users.length > 0 ? (
              dashboardData.recent_users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{user.full_name}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent users</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
            <button 
              onClick={() => router.push('/dashboard/admin/students')}
              className="text-sm text-sky-700 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recent_students.length > 0 ? (
              dashboardData.recent_students.map((student) => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.class_name} ({student.student_code})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(student.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent students</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}