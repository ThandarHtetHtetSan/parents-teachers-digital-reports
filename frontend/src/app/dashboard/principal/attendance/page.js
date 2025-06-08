'use client';
import { useState } from 'react';

export default function PrincipalAttendance() {
  // Mock data - replace with API calls
  const classes = [
    { id: 1, name: 'Grade 5A', teacher: 'Mrs. Johnson', students: 30 },
    { id: 2, name: 'Grade 5B', teacher: 'Mr. Smith', students: 28 },
    { id: 3, name: 'Grade 4A', teacher: 'Ms. Williams', students: 32 },
    { id: 4, name: 'Grade 4B', teacher: 'Mr. Brown', students: 29 }
  ];

  const attendanceRecords = [
    {
      id: 1,
      classId: 1,
      month: 'May 2025',
      present: 28,
      absent: 2,
      total: 30,
      percentage: 93.3
    },
    {
      id: 2,
      classId: 2,
      month: 'May 2025',
      present: 25,
      absent: 3,
      total: 28,
      percentage: 89.3
    },
    {
      id: 3,
      classId: 3,
      month: 'May 2025',
      present: 30,
      absent: 2,
      total: 32,
      percentage: 93.8
    },
    {
      id: 4,
      classId: 4,
      month: 'May 2025',
      present: 27,
      absent: 2,
      total: 29,
      percentage: 93.1
    }
  ];

  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('May 2025');

  // Get unique months for filter
  const months = [...new Set(attendanceRecords.map(record => record.month))];

  // Filter attendance records based on selections
  const filteredRecords = attendanceRecords.filter(record => {
    const classMatch = selectedClass === 'all' || record.classId === parseInt(selectedClass);
    const monthMatch = record.month === selectedMonth;
    return classMatch && monthMatch;
  });

  // Calculate overall statistics
  const overallStats = filteredRecords.reduce((acc, record) => {
    acc.totalPresent += record.present;
    acc.totalAbsent += record.absent;
    acc.totalStudents += record.total;
    return acc;
  }, { totalPresent: 0, totalAbsent: 0, totalStudents: 0 });

  overallStats.percentage = (overallStats.totalPresent / overallStats.totalStudents) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Attendance Overview</h1>
        <button 
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200"
        >
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Present</p>
          <p className="text-2xl font-semibold text-sky-600">{overallStats.totalPresent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Absent</p>
          <p className="text-2xl font-semibold text-sky-600">{overallStats.totalAbsent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-semibold text-sky-600">{overallStats.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Overall Attendance</p>
          <p className={`text-2xl font-semibold ${
            overallStats.percentage >= 90 ? 'text-green-600' :
            overallStats.percentage >= 80 ? 'text-sky-600' :
            'text-red-600'
          }`}>
            {overallStats.percentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => {
                const classInfo = classes.find(c => c.id === record.classId);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classInfo?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{classInfo?.teacher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.absent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.percentage >= 90 ? 'bg-green-100 text-green-800' :
                        record.percentage >= 80 ? 'bg-sky-100 text-sky-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-sky-600 hover:text-sky-700">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 