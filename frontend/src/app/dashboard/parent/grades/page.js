'use client';
import { useState } from 'react';

export default function ParentGrades() {
  // Mock data - replace with API call
  const grades = [
    {
      id: 1,
      studentName: 'John Smith',
      examName: 'First Term Examination',
      subject: 'Mathematics',
      grade: 'A',
      score: 92,
      year: '2025',
      date: '2025-05-27'
    },
    {
      id: 2,
      studentName: 'John Smith',
      examName: 'First Term Examination',
      subject: 'Science',
      grade: 'B+',
      score: 88,
      year: '2025',
      date: '2025-05-27'
    },
    {
      id: 3,
      studentName: 'John Smith',
      examName: 'First Term Examination',
      subject: 'English',
      grade: 'A-',
      score: 90,
      year: '2025',
      date: '2025-05-27'
    },
    {
      id: 4,
      studentName: 'John Smith',
      examName: 'Mid Term Examination',
      subject: 'Mathematics',
      grade: 'A',
      score: 95,
      year: '2025',
      date: '2025-03-15'
    },
    {
      id: 5,
      studentName: 'John Smith',
      examName: 'Mid Term Examination',
      subject: 'Science',
      grade: 'A-',
      score: 89,
      year: '2025',
      date: '2025-03-15'
    },
    {
      id: 6,
      studentName: 'John Smith',
      examName: 'Mid Term Examination',
      subject: 'English',
      grade: 'B+',
      score: 87,
      year: '2025',
      date: '2025-03-15'
    }
  ];

  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedExam, setSelectedExam] = useState('all');

  // Get unique years and exam names for filters
  const years = [...new Set(grades.map(grade => grade.year))];
  const examNames = [...new Set(grades.map(grade => grade.examName))];

  // Filter grades based on selected filters
  const filteredGrades = grades.filter(grade => {
    const yearMatch = grade.year === selectedYear;
    const examMatch = selectedExam === 'all' || grade.examName === selectedExam;
    return yearMatch && examMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Academic Performance</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Exams</option>
            {examNames.map(exam => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.examName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      grade.grade === 'A' ? 'bg-green-100 text-green-800' :
                      grade.grade === 'A-' ? 'bg-green-50 text-green-700' :
                      grade.grade === 'B+' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(grade.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
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