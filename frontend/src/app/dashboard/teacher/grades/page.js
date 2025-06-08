'use client';
import { useState } from 'react';

export default function TeacherGrades() {
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

  const examTypes = [
    'Mid-term Exam',
    'Final Exam',
    'Unit Test 1',
    'Unit Test 2',
    'Unit Test 3',
    'Quiz 1',
    'Quiz 2',
    'Assignment 1',
    'Assignment 2'
  ];

  const gradeList = [
    {
      id: 1,
      class: 'Grade 5A',
      subject: 'Mathematics',
      teacher: 'Mrs. Johnson',
      exam: 'Mid-term Exam',
      year: '2024',
      date: '2024-03-15',
      grades: [
        { studentId: 1, score: 85, grade: 'A', remark: 'Excellent work' },
        { studentId: 2, score: 78, grade: 'B+', remark: 'Good effort' }
      ]
    },
    {
      id: 2,
      class: 'Grade 5B',
      subject: 'Science',
      teacher: 'Mrs. Johnson',
      exam: 'Unit Test 3',
      year: '2024',
      date: '2024-03-10',
      grades: [
        { studentId: 3, score: 92, grade: 'A-', remark: 'Very good understanding' },
        { studentId: 4, score: 75, grade: 'B', remark: 'Needs improvement' }
      ]
    }
  ];

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examYear, setExamYear] = useState(new Date().getFullYear().toString());
  const [grades, setGrades] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Filter students based on selected class
  const filteredStudents = students.filter(student => 
    !selectedClass || student.class === selectedClass
  );

  // Filter grade list based on selections
  const filteredGrades = gradeList.filter(grade => {
    const classMatch = !selectedClass || grade.class === selectedClass;
    const examMatch = !selectedExam || grade.exam === selectedExam;
    const yearMatch = !selectedYear || grade.year === selectedYear;
    const teacherMatch = grade.teacher === teacherInfo.name;
    return classMatch && examMatch && yearMatch && teacherMatch;
  });

  // Get unique exams for filter
  const availableExams = [...new Set(gradeList
    .filter(grade => grade.teacher === teacherInfo.name)
    .map(grade => grade.exam))];

  // Generate year options (current year and 2 years back)
  const yearOptions = Array.from({ length: 3 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  const handleGradeChange = (studentId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmitGrades = () => {
    // TODO: Implement API call to save grades
    console.log('Saving grades:', {
      class: selectedClass,
      examName,
      examDate,
      examYear,
      grades
    });
    // Reset form
    setExamName('');
    setExamDate('');
    setExamYear(new Date().getFullYear().toString());
    setGrades({});
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Grades</h1>
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200"
        >
          {isAddingNew ? 'Cancel' : 'Add New Grades'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">All Exams</option>
            {availableExams.map(exam => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Grades Form */}
      {isAddingNew && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Grades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Select Exam Type</option>
              {examTypes.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <select
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Students List */}
          {selectedClass && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
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
                          max="100"
                          value={grades[student.id]?.score || ''}
                          onChange={(e) => handleGradeChange(student.id, 'score', parseInt(e.target.value) || '')}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={grades[student.id]?.grade || ''}
                          onChange={(e) => handleGradeChange(student.id, 'grade', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                          <option value="">Select Grade</option>
                          {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Add remark"
                          value={grades[student.id]?.remark || ''}
                          onChange={(e) => handleGradeChange(student.id, 'remark', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button */}
          {selectedClass && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitGrades}
                disabled={!examName || !examDate || !examYear || Object.keys(grades).length === 0}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Grades
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grade List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGrades.flatMap(gradeRecord => 
                gradeRecord.grades.map(grade => {
                  const student = students.find(s => s.id === grade.studentId);
                  return (
                    <tr key={`${gradeRecord.id}-${grade.studentId}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gradeRecord.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gradeRecord.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gradeRecord.exam}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(gradeRecord.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.score}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-600">{grade.grade}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{grade.remark}</td>
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