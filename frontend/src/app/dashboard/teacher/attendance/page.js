'use client';
import { useState, useEffect } from 'react';

export default function TeacherAttendance() {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAttendanceData, setNewAttendanceData] = useState({
    selectedClass: '',
    selectedMonth: '',
    selectedYear: new Date().getFullYear().toString(),
    attendance: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacher = localStorage.getItem('teacher');
        if (!teacher) {
          alert('Teacher session not found. Please login again.');
          return;
        }
        const teacherObj = JSON.parse(teacher);

        // Fetch attendance data
        const attendanceResponse = await fetch(`http://127.0.0.1:5000/teachers/attendance?teacher_id=${teacherObj.id}`);
        const attendanceData = await attendanceResponse.json();
        
        if (attendanceData.success) {
          setAttendance(attendanceData.attendance);
          // Auto-select latest month/year in Filter if available
          const uniqueMonths = [...new Set(attendanceData.attendance.map(record => `${record.month}/${record.year}`))];
          if (uniqueMonths.length > 0) {
            setSelectedMonth(uniqueMonths[0]);
          }
        }

        // Fetch classes data
        const classesResponse = await fetch(`http://127.0.0.1:5000/teachers/classes?teacher_id=${teacherObj.id}`);
        const classesData = await classesResponse.json();
        
        if (classesData.success) {
          setClasses(classesData.classes);
          // Set first class as default for both filter and add form
          if (classesData.classes.length > 0) {
            const firstClass = classesData.classes[0];
            const defaultClass = `${firstClass.class_name} - ${firstClass.subject_name}`;
            setSelectedClass(defaultClass);
            setNewAttendanceData(prev => ({
              ...prev,
              selectedClass: defaultClass
            }));
          }
        }

        // Initialize add-form month/year defaults to current
        const now = new Date();
        const currentMonth = String(now.getMonth() + 1); // numeric month for backend
        const currentYear = String(now.getFullYear());
        setNewAttendanceData(prev => ({
          ...prev,
          selectedMonth: currentMonth,
          selectedYear: currentYear
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Keep add-form class in sync with filter selection and open-state
  useEffect(() => {
    if (isAddingNew && selectedClass) {
      setNewAttendanceData(prev => ({ ...prev, selectedClass }));
    }
  }, [isAddingNew, selectedClass]);

  // Get unique months for filter
  const months = [...new Set(attendance.map(record => `${record.month}/${record.year}`))];

  // Filter attendance records based on selections
  const filteredRecords = attendance.filter(record => {
    const classMatch = !selectedClass || 
      `${record.class_name} - ${record.subject_name}` === selectedClass;
    const monthMatch = !selectedMonth || 
      `${record.month}/${record.year}` === selectedMonth;
    return classMatch && monthMatch;
  });
  
  console.log("filteredRecords", filteredRecords);

  // Get students for selected class in Add New Attendance form
  const selectedClassData = classes.find(cls => 
    `${cls.class_name} - ${cls.subject_name}` === newAttendanceData.selectedClass
  );

  const handleAttendanceChange = (studentId, field, value) => {
    const numValue = parseInt(value) || 0;
    setNewAttendanceData(prev => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [studentId]: {
          ...prev.attendance[studentId],
          [field === 'present' ? 'present_days' : 'absent_days']: numValue
        }
      }
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const teacher = localStorage.getItem('teacher');
      if (!teacher) {
        alert('Teacher session not found. Please login again.');
        return;
      }
      const teacherObj = JSON.parse(teacher);

      const response = await fetch('http://127.0.0.1:5000/teachers/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherObj.id,
          attendance_data: newAttendanceData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        // Reset form
        setNewAttendanceData(prev => ({
          ...prev,
          attendance: {}
        }));
        setIsAddingNew(false);
        
        // Refresh attendance data
        const attendanceResponse = await fetch(`http://127.0.0.1:5000/teachers/attendance?teacher_id=${teacherObj.id}`);
        const attendanceData = await attendanceResponse.json();
        if (attendanceData.success) {
          setAttendance(attendanceData.attendance);
        }
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    }
  };

  // Generate month options (current month and 2 months back)
  const monthOptions = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: date.getMonth() + 1,
      label: date.getMonth() + 1
    };
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading attendance...</div>;
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls.id} value={`${cls.class_name} - ${cls.subject_name}`}>{cls.class_name} - {cls.subject_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month / Year</label>
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
        </div>
      </div>

      {/* Add New Attendance Form */}
      {isAddingNew && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Record Monthly Attendance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={newAttendanceData.selectedClass}
                  onChange={(e) => setNewAttendanceData(prev => ({ ...prev, selectedClass: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={`${cls.class_name} - ${cls.subject_name}`}>{cls.class_name} - {cls.subject_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={newAttendanceData.selectedMonth}
                  onChange={(e) => setNewAttendanceData(prev => ({ ...prev, selectedMonth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  {monthOptions.map(month => (
                    <option key={month.value} value={`${month.value}`}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={newAttendanceData.selectedYear}
                  onChange={(e) => setNewAttendanceData(prev => ({ ...prev, selectedYear: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                    <option key={y} value={`${y}`}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

          {/* Students List */}
          {newAttendanceData.selectedClass && newAttendanceData.selectedMonth && (
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
                  {selectedClassData?.students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={newAttendanceData.attendance[student.student_id]?.present_days || ''}
                          onChange={(e) => handleAttendanceChange(student.student_id, 'present', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={newAttendanceData.attendance[student.student_id]?.absent_days || ''}
                          onChange={(e) => handleAttendanceChange(student.student_id, 'absent', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {newAttendanceData.attendance[student.student_id]?.present_days 
                          ? `${Math.round((newAttendanceData.attendance[student.student_id].present_days / 20) * 100)}%`
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
          {newAttendanceData.selectedClass && newAttendanceData.selectedMonth && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitAttendance}
                disabled={Object.keys(newAttendanceData.attendance).length === 0}
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
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${record.class_name} - ${record.subject_name}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${record.month}/${record.year}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.present_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.absent_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.total_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      record.percentage >= 80 ? 'bg-sky-100 text-sky-800' :
                      'bg-red-100 text-red-800'
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