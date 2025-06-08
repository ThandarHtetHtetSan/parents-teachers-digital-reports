'use client';
import { useState } from 'react';

export default function PrincipalGrades() {
  // Mock data - replace with API calls
  const students = [
    {
      id: 1,
      name: 'John Smith',
      class: 'Grade 5A',
      teacher: 'Mrs. Johnson',
      grades: {
        mathematics: 'A',
        science: 'B+',
        english: 'A-',
        average: 'A-'
      }
    },
    {
      id: 2,
      name: 'Emma Wilson',
      class: 'Grade 5A',
      teacher: 'Mrs. Johnson',
      grades: {
        mathematics: 'A+',
        science: 'A',
        english: 'A',
        average: 'A+'
      }
    },
    {
      id: 3,
      name: 'Michael Brown',
      class: 'Grade 4B',
      teacher: 'Mr. Brown',
      grades: {
        mathematics: 'B+',
        science: 'B',
        english: 'A-',
        average: 'B+'
      }
    }
  ];

  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique classes for filter
  const classes = [...new Set(students.map(student => student.class))];

  // Filter students based on search and class selection
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Students Grades</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div 
            key={student.id} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.class} • {student.teacher}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-lg font-semibold text-sky-600">{student.grades.average}</p>
              </div>
            </div>

            {/* Grades Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Subject Grades</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mathematics</span>
                  <span className="text-sm font-medium text-sky-600">{student.grades.mathematics}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Science</span>
                  <span className="text-sm font-medium text-sky-600">{student.grades.science}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">English</span>
                  <span className="text-sm font-medium text-sky-600">{student.grades.english}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 