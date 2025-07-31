'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ParentAttendance() {
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parent = localStorage.getItem('parent');
    if (!parent) {
      router.push('/login');
      return;
    }
    const parentObj = JSON.parse(parent);
    fetch(`http://127.0.0.1:5000/parents/attendance?parent_id=${parentObj.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAttendanceRecords(data.attendance);
          // Set default year to latest year in data
          if (data.attendance.length) {
            setSelectedYear(data.attendance[0].year.toString());
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get unique years for filter
  const years = [...new Set(attendanceRecords.map(record => record.year?.toString()))];

  // Filter attendance based on selected year
  const filteredAttendance = attendanceRecords.filter(record =>
    record.year?.toString() === selectedYear
  );

  // Calculate overall statistics
  const overallStats = filteredAttendance.reduce((acc, record) => {
    acc.totalPresent += record.present_count;
    acc.totalAbsent += record.absent_count;
    acc.totalDays += record.total_count;
    return acc;
  }, { totalPresent: 0, totalAbsent: 0, totalDays: 0 });

  const overallPercentage = overallStats.totalDays
    ? Math.round((overallStats.totalPresent / overallStats.totalDays) * 100)
    : 0;

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading attendance...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Attendance Records</h1>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Overall Statistics Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Overall Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Present Days</p>
            <p className="text-2xl font-semibold text-sky-600">{overallStats.totalPresent}</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Absent Days</p>
            <p className="text-2xl font-semibold text-sky-600">{overallStats.totalAbsent}</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-sm text-gray-600">Total School Days</p>
            <p className="text-2xl font-semibold text-sky-600">{overallStats.totalDays}</p>
          </div>
          <div className="p-4 bg-sky-50 rounded-lg">
            <p className="text-sm text-gray-600">Overall Attendance</p>
            <p className="text-2xl font-semibold text-sky-600">{overallPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${record.month} ${record.year}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.present_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.absent_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.total_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      record.percentage >= 80 ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {Math.round(record.percentage)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}