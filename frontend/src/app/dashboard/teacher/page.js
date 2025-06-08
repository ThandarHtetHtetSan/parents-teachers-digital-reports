'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const router = useRouter();
  // Mock data - replace with API calls
  const teacherInfo = {
    name: 'Mrs. Johnson',
    classes: [
      { 
        id: 1,
        name: 'Grade 5A', 
        subject: 'Mathematics',
        totalStudents: 30
      },
      { 
        id: 2,
        name: 'Grade 5B', 
        subject: 'Science',
        totalStudents: 28
      }
    ]
  };

  const classAttendance = {
    'Grade 5A': {
      present: 28,
      absent: 2,
      total: 30,
      month: 'May 2025'
    },
    'Grade 5B': {
      present: 25,
      absent: 3,
      total: 28,
      month: 'May 2025'
    }
  };

  const classGrades = {
    'Grade 5A': [
      { subject: 'Mathematics', grade: 'A', date: '2024-03-15', exam: 'Mid Term' },
      { subject: 'Mathematics', grade: 'B+', date: '2024-03-10', exam: 'Quiz 1' }
    ],
    'Grade 5B': [
      { subject: 'Science', grade: 'A-', date: '2024-03-15', exam: 'Mid Term' },
      { subject: 'Science', grade: 'B', date: '2024-03-10', exam: 'Quiz 1' }
    ]
  };

  const recentAnnouncements = [
    {
      title: 'Parent-Teacher Meeting',
      date: '2024-03-20',
      description: 'Annual parent-teacher meeting scheduled for next week.'
    },
    {
      title: 'School Holiday',
      date: '2024-03-25',
      description: 'School will be closed for spring break.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome, {teacherInfo.name}</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Class Overview Cards */}
      {teacherInfo.classes.map(cls => (
        <div key={cls.id} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">{cls.name} - {cls.subject}</h2>
            <span className="text-sm text-gray-500">{cls.totalStudents} Students</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800">Attendance</h3>
                <span className="text-xs text-gray-500">{classAttendance[cls.name].month}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-semibold text-sky-600">
                  {Math.round((classAttendance[cls.name].present / classAttendance[cls.name].total) * 100)}%
                </div>
                <div className="text-sm text-gray-600">
                  <p>{classAttendance[cls.name].present} days present</p>
                  <p>{classAttendance[cls.name].absent} days absent</p>
                </div>
              </div>
              <div className="mt-auto">
                <button 
                  onClick={() => router.push('/dashboard/teacher/attendance')}
                  className="w-full py-2 px-4 bg-sky-50 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Record Attendance</span>
                </button>
              </div>
            </div>

            {/* Grades Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800">Recent Grades</h3>
                <span className="text-xs text-gray-500">27 May 2025</span>
              </div>
              <div className="space-y-2 mb-4">
                {classGrades[cls.name].map((grade, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">{grade.exam}</span>
                      <span className="text-xs text-gray-500 ml-2">({grade.date})</span>
                    </div>
                    <span className="text-sm font-medium text-sky-600">{grade.grade}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <button 
                  onClick={() => router.push('/dashboard/teacher/grades')}
                  className="w-full py-2 px-4 bg-sky-50 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Grades</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Recent Announcements */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Recent Announcements</h3>
          <button 
            onClick={() => router.push('/dashboard/teacher/announcements')}
            className="text-sm text-sky-600 hover:text-sky-700"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentAnnouncements.map((announcement, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{announcement.title}</h4>
                <span className="text-sm text-gray-500">{announcement.date}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{announcement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
