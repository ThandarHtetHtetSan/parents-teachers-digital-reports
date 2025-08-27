'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const teacher = localStorage.getItem('teacher');
    if (!teacher) {
      router.push('/login');
      return;
    }
    const teacherObj = JSON.parse(teacher);

    fetch(`http://127.0.0.1:5000/teachers/dashboard?teacher_id=${teacherObj.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setDashboard(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  const { teacher, classes, announcements } = dashboard;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome, {teacher.name}</h1>
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
      {classes.length > 0 ? (
        classes.map(cls => (
          <div key={cls.class_id} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-800">{cls.class_name} - {cls.subject_name}</h2>
              <span className="text-sm text-gray-500">{cls.total_students} Students</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Attendance</h3>
                  <span className="text-xs text-gray-500">
                    {cls.attendance ? `${cls.attendance.month}/${cls.attendance.year}` : 'No data'}
                  </span>
                </div>
                {cls.attendance ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-semibold text-sky-600">
                        {Math.round(cls.attendance.percentage)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{cls.attendance.present_days} days present</p>
                        <p>{cls.attendance.absent_days} days absent</p>
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
                  </>
                ) : (
                  <div className="text-sm text-gray-400 mb-4">No attendance data available.</div>
                )}
              </div>

              {/* Grades Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Recent Grades</h3>
                  <span className="text-xs text-gray-500">
                    {cls.recent_grades.length > 0 ? 'Latest Exam' : 'No data'}
                  </span>
                </div>
                {cls.recent_grades.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {cls.recent_grades.map((grade, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-600">{grade.exam_name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({grade.exam_date ? new Date(grade.exam_date).toLocaleDateString() : 'N/A'})
                            </span>
                          </div>
                          <span className="text-sm font-medium text-sky-600">
                            {grade.letter_grade || grade.score}
                          </span>
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
                  </>
                ) : (
                  <div className="text-sm text-gray-400 mb-4">No grades data available.</div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-center">No classes assigned yet.</p>
        </div>
      )}

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
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{announcement.title}</h4>
                  <span className="text-sm text-gray-500">
                    {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{announcement.body}</p>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400">No announcements available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
