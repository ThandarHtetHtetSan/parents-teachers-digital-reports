'use client';
import { useEffect, useState } from 'react';

const YEARS = ['2025', '2024', '2023'];

export default function PrincipalAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch filter options
  useEffect(() => {
    fetch('http://127.0.0.1:5000/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.classes.length > 0) {
          setClasses(data.classes);
          setSelectedClass(data.classes[0].name);
        }
      });
    fetch('http://127.0.0.1:5000/subjects')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.subjects.length > 0) {
          setSubjects(data.subjects);
          setSelectedSubject(data.subjects[0].name);
        }
      });
    // Months are static for demo
    setMonths(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
    setSelectedMonth('6');
  }, []);

  // Fetch attendance records when filters change
  useEffect(() => {
    if (!selectedClass || !selectedSubject || !selectedMonth || !selectedYear) return;
    setLoading(true);
    fetch(`http://127.0.0.1:5000/principal/attendance?class=${selectedClass}&subject=${selectedSubject}&month=${selectedMonth}&year=${selectedYear}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAttendanceRecords(data.attendance_records);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedClass, selectedSubject, selectedMonth, selectedYear]);

  // Filter attendance records based on student name
  const filteredRecords = attendanceRecords.filter(record =>
    record.student_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading attendance...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Attendance Overview</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-4 items-end">
          <div className='min-w-28'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls.name} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div className='min-w-28'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {subjects.map(sub => (
                <option key={sub.name} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className='min-w-28'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className='min-w-28'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className='flex-1'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Search Student</label>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.student_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.present_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.absent_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.total_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      record.percentage >= 80 ? 'bg-sky-100 text-sky-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}