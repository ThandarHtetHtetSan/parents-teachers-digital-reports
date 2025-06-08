'use client';
import { useState } from 'react';

export default function ParentAttendance() {
  // Mock data - replace with API call
  const attendanceRecords = [
    {
      id: 1,
      month: 'May 2025',
      present_count: 18,
      absent_count: 2,
      total_count: 20,
      percentage: 90,
      date: '2025-05-31'
    },
    {
      id: 2,
      month: 'April 2025',
      present_count: 20,
      absent_count: 0,
      total_count: 20,
      percentage: 100,
      date: '2025-04-30'
    },
    {
      id: 3,
      month: 'March 2025',
      present_count: 19,
      absent_count: 1,
      total_count: 20,
      percentage: 95,
      date: '2025-03-31'
    },
    {
      id: 4,
      month: 'February 2025',
      present_count: 17,
      absent_count: 3,
      total_count: 20,
      percentage: 85,
      date: '2025-02-28'
    }
  ];

  const [selectedYear, setSelectedYear] = useState('2025');

  // Get unique years for filter
  const years = [...new Set(attendanceRecords.map(record => record.date.split('-')[0]))];

  // Filter attendance based on selected year
  const filteredAttendance = attendanceRecords.filter(record => 
    record.date.startsWith(selectedYear)
  );

  // Calculate overall statistics
  const overallStats = filteredAttendance.reduce((acc, record) => {
    acc.totalPresent += record.present_count;
    acc.totalAbsent += record.absent_count;
    acc.totalDays += record.total_count;
    return acc;
  }, { totalPresent: 0, totalAbsent: 0, totalDays: 0 });

  const overallPercentage = Math.round((overallStats.totalPresent / overallStats.totalDays) * 100);

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.present_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.absent_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.total_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      record.percentage >= 80 ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {record.percentage}%
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