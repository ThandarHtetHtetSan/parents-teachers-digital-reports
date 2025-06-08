'use client';
import { useState } from 'react';

export default function TeacherAttendance() {
  // Mock data - replace with API calls
  const teacherInfo = {
    id: 1,
    name: 'Mrs. Johnson',
    classes: [
      { id: 1, name: 'Grade 5A', subject: 'Mathematics' },
      { id: 2, name: 'Grade 5B', subject: 'Science' }
    ]
  };

  const students = [
    { id: 1, name: 'John Smith', class: 'Grade 5A' },
    { id: 2, name: 'Emma Johnson', class: 'Grade 5A' },
    { id: 3, name: 'Michael Brown', class: 'Grade 5B' },
    { id: 4, name: 'Sarah Wilson', class: 'Grade 5B' }
  ];

  const attendanceRecords = [
    {
      id: 1,
      class: 'Grade 5A',
      month: 'May 2024',
      teacher: 'Mrs. Johnson',
      records: [
        { studentId: 1, present: 18, absent: 2, total: 20 },
        { studentId: 2, present: 19, absent: 1, total: 20 }
      ]
    },
    {
      id: 2,
      class: 'Grade 5B',
      month: 'May 2024',
      teacher: 'Mrs. Johnson',
      records: [
        { studentId: 3, present: 17, absent: 3, total: 20 },
        { studentId: 4, present: 20, absent: 0, total: 20 }
      ]
    }
  ];

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAttendance, setNewAttendance] = useState({});

  // Get unique months for filter
  const months = [...new Set(attendanceRecords.map(record => record.month))];

  // Filter attendance records based on selections
  const filteredRecords = attendanceRecords.filter(record => {
    const classMatch = !selectedClass || record.class === selectedClass;
    const monthMatch = !selectedMonth || record.month === selectedMonth;
    const teacherMatch = record.teacher === teacherInfo.name;
    return classMatch && monthMatch && teacherMatch;
  });

  // Filter students based on selected class
  const filteredStudents = students.filter(student => 
    !selectedClass || student.class === selectedClass
  );

  const handleAttendanceChange = (studentId, field, value) => {
    setNewAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: parseInt(value) || 0,
        total: 20 // Assuming 20 school days per month
      }
    }));
  };

  const handleSubmitAttendance = () => {
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', {
      class: selectedClass,
      month: selectedMonth,
      records: newAttendance
    });
    // Reset form
    setNewAttendance({});
    setIsAddingNew(false);
  };

  // Generate month options (current month and 2 months back)
  const monthOptions = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Attendance</h1>
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200"
        >
          {isAddingNew ? 'Cancel' : 'Record Attendance'}
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
            <option value="">All Classes</option>
            {teacherInfo.classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name} - {cls.subject}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">All Months</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Attendance Form */}
      {isAddingNew && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Record Monthly Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Select Class</option>
              {teacherInfo.classes.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name} - {cls.subject}</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Select Month</option>
              {monthOptions.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Students List */}
          {selectedClass && selectedMonth && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={newAttendance[student.id]?.present || ''}
                          onChange={(e) => handleAttendanceChange(student.id, 'present', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={newAttendance[student.id]?.absent || ''}
                          onChange={(e) => handleAttendanceChange(student.id, 'absent', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {newAttendance[student.id]?.present 
                          ? `${Math.round((newAttendance[student.id].present / 20) * 100)}%`
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button */}
          {selectedClass && selectedMonth && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitAttendance}
                disabled={Object.keys(newAttendance).length === 0}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Attendance
              </button>
            </div>
          )}
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.flatMap(record => 
                record.records.map(attendance => {
                  const student = students.find(s => s.id === attendance.studentId);
                  const percentage = (attendance.present / attendance.total) * 100;
                  return (
                    <tr key={`${record.id}-${attendance.studentId}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.present}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.absent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          percentage >= 90 ? 'bg-green-100 text-green-800' :
                          percentage >= 80 ? 'bg-sky-100 text-sky-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 