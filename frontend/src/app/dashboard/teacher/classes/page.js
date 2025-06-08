'use client';
import { useState } from 'react';

export default function TeacherClasses() {
  // Mock data - replace with API calls
  const teacherInfo = {
    id: 1,
    name: 'Mrs. Johnson',
    classes: [
      { 
        id: 1, 
        name: 'Grade 5A', 
        subject: 'Mathematics',
        schedule: 'Monday, Wednesday, Friday (9:00 AM - 10:30 AM)',
        room: 'Room 101',
        totalStudents: 30
      },
      { 
        id: 2, 
        name: 'Grade 5B', 
        subject: 'Science',
        schedule: 'Tuesday, Thursday (11:00 AM - 12:30 PM)',
        room: 'Room 102',
        totalStudents: 28
      }
    ]
  };

  const students = [
    { 
      id: 1, 
      name: 'John Smith', 
      class: 'Grade 5A',
      rollNumber: '5A001',
      parentName: 'Mr. Smith',
      contact: '+1234567890'
    },
    { 
      id: 2, 
      name: 'Emma Johnson', 
      class: 'Grade 5A',
      rollNumber: '5A002',
      parentName: 'Mrs. Johnson',
      contact: '+1234567891'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      class: 'Grade 5B',
      rollNumber: '5B001',
      parentName: 'Mr. Brown',
      contact: '+1234567892'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      class: 'Grade 5B',
      rollNumber: '5B002',
      parentName: 'Mrs. Wilson',
      contact: '+1234567893'
    }
  ];

  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on selected class and search query
  const filteredStudents = students.filter(student => {
    const classMatch = !selectedClass || student.class === selectedClass;
    const searchMatch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return classMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">My Classes</h1>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teacherInfo.classes.map(cls => (
          <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">{cls.name}</h2>
                <p className="text-sm text-gray-600">{cls.subject}</p>
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
                {cls.totalStudents} Students
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
                <option value="">All Classes</option>
                {teacherInfo.classes.map(cls => (
                  <option key={cls.id} value={cls.name}>{cls.name} - {cls.subject}</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.parentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 