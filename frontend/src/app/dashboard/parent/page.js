'use client';

export default function ParentDashboard() {
  // Mock data - replace with actual API calls
  const childInfo = {
    name: 'John Smith',
    grade: 'Grade 5',
    class: '5A',
    teacher: 'Mrs. Johnson'
  };

  const recentGrades = [
    { subject: 'Mathematics', grade: 'A', date: '2024-03-15' },
    { subject: 'Science', grade: 'B+', date: '2024-03-10' },
    { subject: 'English', grade: 'A-', date: '2024-03-05' }
  ];

  const attendance = {
    present: 18,
    absent: 2,
    total: 20,
    month: 'May 2025'
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
        <h1 className="text-2xl font-semibold text-gray-800">Welcome, {childInfo.name}&apos;s Parent</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Academic Performance</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Current Grade: {childInfo.grade}</p>
            <p className="text-sm text-gray-600">Class: {childInfo.class}</p>
            <p className="text-sm text-gray-600">Class Teacher: {childInfo.teacher}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800">Attendance</h3>
            <span className="text-xs text-gray-500">{attendance.month}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-semibold text-sky-600">
              {Math.round((attendance.present / attendance.total) * 100)}%
            </div>
            <div className="text-sm text-gray-600">
              <p>{attendance.present} days present</p>
              <p>{attendance.absent} days absent</p>
            </div>
          </div>
          <div className="mt-auto">
            <button 
              className="w-full py-2 px-4 bg-sky-50 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Confirm Attendance</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800">First Term Grades</h3>
            <span className="text-xs text-gray-500">27 May 2025</span>
          </div>
          <div className="space-y-2 mb-4">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{grade.subject}</span>
                <span className="text-sm font-medium text-sky-600">{grade.grade}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <button 
              className="w-full py-2 px-4 bg-sky-50 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Confirm Grades</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Announcements</h3>
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
