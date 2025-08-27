'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherClasses() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const teacher = localStorage.getItem('teacher');
    if (!teacher) {
      router.push('/login');
      return;
    }
    const teacherObj = JSON.parse(teacher);

    fetch(`http://127.0.0.1:5000/teachers/classes?teacher_id=${teacherObj.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Add random schedule and room data to each class
          const classesWithSchedule = data.classes.map(cls => ({
            ...cls,
            schedule: generateRandomSchedule(),
            room: generateRandomRoom()
          }));
          setClasses(classesWithSchedule);
          setSelectedClass(classesWithSchedule[0]?.class_name + ' - ' + classesWithSchedule[0]?.subject_name);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Generate random schedule
  const generateRandomSchedule = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
      '(9:00 AM - 10:30 AM)',
      '(11:00 AM - 12:30 PM)',
      '(2:00 PM - 3:30 PM)',
      '(4:00 PM - 5:30 PM)'
    ];
    
    const selectedDays = days.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
    const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
    
    return `${selectedDays.join(', ')} ${timeSlot}`;
  };

  // Generate random room
  const generateRandomRoom = () => {
    const roomNumbers = ['101', '102', '103', '201', '202', '203', '301', '302', '303'];
    const roomNumber = roomNumbers[Math.floor(Math.random() * roomNumbers.length)];
    return `Room ${roomNumber}`;
  };

  // Get all students from all classes
  const allStudents = classes.reduce((acc, cls) => {
    return acc.concat(cls.students.map(student => ({
      ...student,
      class_name: cls.class_name,
      subject_name: cls.subject_name
    })));
  }, []);

  // Filter students based on selected class and search query
  const filteredStudents = allStudents.filter(student => {
    const classMatch = !selectedClass || 
      `${student.class_name} - ${student.subject_name}` === selectedClass;
    const searchMatch = !searchQuery || 
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent_name.toLowerCase().includes(searchQuery.toLowerCase());
    return classMatch && searchMatch;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading classes...</div>;
  }

  if (!classes.length) {
    return <div className="p-8 text-center text-gray-500">No classes assigned yet.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">My Classes</h1>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map(cls => (
          <div key={`${cls.class_id}_${cls.subject_id}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">{cls.class_name}</h2>
                <p className="text-sm text-gray-600">{cls.subject_name}</p>
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
                {cls.students.length} Students
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-800">Schedule</p>
                  <p className="text-sm text-gray-600">{cls.schedule}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-800">Room</p>
                  <p className="text-sm text-gray-600">{cls.room}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-medium text-gray-800">Students</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {/* <option value="">All Classes</option> */}
                {classes.map(cls => (
                  <option key={`${cls.class_id}_${cls.subject_id}`} value={`${cls.class_name} - ${cls.subject_name}`}>
                    {cls.class_name} - {cls.subject_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.student_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.subject_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.parent_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.parent_email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 