'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrincipalDashboard() {
  const router = useRouter();
  // Mock data - replace with API calls
  const stats = {
    totalStudents: 450,
    totalTeachers: 25,
    totalClasses: 15,
    averageAttendance: 92,
    averageGrade: 'B+'
  };

  const recentReports = [
    {
      id: 1,
      class: 'Grade 5A',
      type: 'Grades',
      date: '2025-05-27',
      status: 'Published'
    },
    {
      id: 2,
      class: 'Grade 4B',
      type: 'Attendance',
      date: '2025-05-26',
      status: 'Draft'
    }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2025-05-20',
      type: 'Meeting',
      priority: 'High'
    },
    {
      id: 2,
      title: 'School Holiday',
      date: '2025-05-15',
      type: 'Holiday',
      priority: 'Medium'
    }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <button 
          onClick={() => router.push('/dashboard/principal/analytics')}
          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-left"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-2">View Analytics</h3>
          <p className="text-sm text-gray-600">View school-wide performance and attendance analytics</p>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-semibold text-sky-600">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Teachers</p>
          <p className="text-2xl font-semibold text-sky-600">{stats.totalTeachers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Classes</p>
          <p className="text-2xl font-semibold text-sky-600">{stats.totalClasses}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Average Attendance</p>
          <p className="text-2xl font-semibold text-sky-600">{stats.averageAttendance}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Average Grade</p>
          <p className="text-2xl font-semibold text-sky-600">{stats.averageGrade}</p>
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
            {recentReports.map((report) => (
              <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{report.class}</p>
                  <p className="text-sm text-gray-600">{report.type} Report</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(report.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
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
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        announcement.priority === 'High' ? 'bg-red-100 text-red-800' :
                        announcement.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {announcement.priority}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                        {announcement.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
