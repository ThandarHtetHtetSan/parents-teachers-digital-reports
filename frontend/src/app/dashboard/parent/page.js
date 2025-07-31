'use client';
import { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useRouter } from 'next/navigation';

export default function ParentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const parent = localStorage.getItem('parent');
    if (!parent) {
      router.push('/login');
      return;
    }
    const parentObj = JSON.parse(parent);

    fetch(`http://127.0.0.1:5000/parents/dashboard?parent_id=${parentObj.id}`)
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

  const { parent, children, announcements } = dashboard;
  const child = children[0];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sky-700 mb-1 flex items-center gap-2">
              Welcome, {parent.name}
            </h1>
            <p className="text-gray-500 text-sm">
              Here’s your child’s latest school summary.
            </p>
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Info */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-sky-100 hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 group-hover:bg-sky-200 transition">
                {/* User icon */}
                <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
              </span>
              <h3 className="text-lg font-semibold text-sky-700">Student Info</h3>
            </div>
            {child ? (
              <div className="px-2 space-y-2 text-gray-700 mt-6">
                <div><span className="font-medium">Name:</span> {child.student_name}</div>
                <div><span className="font-medium">Class:</span> {child.class_name}</div>
                <div><span className="font-medium">Code:</span> {child.student_code}</div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No children found.</p>
            )}
          </div>

          {/* Attendance with Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 group-hover:bg-green-200 transition">
                {/* Chart Pie icon */}
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9 9 0 1021 12h-9V3.055z"/></svg>
              </span>
              <h3 className="text-lg font-semibold text-green-700">Attendance</h3>
              <span className="ml-auto text-xs text-gray-400">
                {child?.attendance?.month}/{child?.attendance?.year}
              </span>
            </div>
            {child?.attendance ? (
              <div className="flex flex-col items-center justify-center mb-2">
                <PieChart
                  data={[
                    { title: 'Present', value: child.attendance.present_days, color: '#22c55e' },
                    { title: 'Absent', value: child.attendance.absent_days, color: '#ef4444' },
                  ]}
                  totalValue={parseInt(child.attendance.present_days) + parseInt(child.attendance.absent_days)}
                  lineWidth={30}
                  rounded
                  animate
                  label={({ dataEntry }) => dataEntry.value > 0 ? `${Math.round(dataEntry.value)}d` : ''}
                  labelStyle={{
                    fontSize: '10px',
                    fill: '#374151',
                  }}
                  style={{ height: '100px' }}
                />
                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                    {child.attendance.present_days} present
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                    {child.attendance.absent_days} absent
                  </span>
                </div>
                <div className="text-lg font-bold text-green-600 mt-2">
                  {Math.round(child.attendance.percentage)}%
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">No attendance data.</div>
            )}
          </div>

          {/* Latest Exam */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-200 transition">
                {/* Academic Cap icon */}
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0l-3-3m3 3l3-3"/></svg>
              </span>
              <h3 className="text-lg font-semibold text-purple-700">Latest Exam</h3>
              <span className="ml-auto text-xs text-gray-400">
                {child?.latest_exam?.exam_name || 'N/A'}
              </span>
            </div>
            <div className="space-y-2">
              {child?.latest_exam?.subjects?.length ? (
                child.latest_exam.subjects.map((subj, idx) => (
                  <div key={idx} className="flex justify-between items-center text-gray-700">
                    <span>{subj.subject_name}</span>
                    <span className="font-semibold text-purple-600">{subj.score}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No grades available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100">
          <h3 className="text-xl font-bold text-sky-700 mb-6 flex items-center gap-2">
            {/* Bell icon */}
            <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Recent Announcements
          </h3>
          <div className="space-y-6">
            {announcements.length ? announcements.map((a, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{a.title}</h4>
                  <span className="text-xs text-gray-400">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{a.body}</p>
              </div>
            )) : <div className="text-sm text-gray-400">No announcements.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}