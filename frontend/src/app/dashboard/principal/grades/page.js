'use client';
import { useEffect, useState } from 'react';

const YEARS = ['2025', '2024', '2023'];

export default function PrincipalGrades() {
  const [studentsGrades, setStudentsGrades] = useState([]);
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch exams for filter
  useEffect(() => {
    fetch('http://127.0.0.1:5000/exams')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.exams.length > 0) {
          setExams(data.exams);
          setSelectedExam(data.exams[0].name);
        }
      });
  }, []);

  // Fetch grades when year or exam changes
  useEffect(() => {
    if (!selectedYear || !selectedExam) return;
    setLoading(true);
    fetch(`http://127.0.0.1:5000/principal/grades?year=${selectedYear}&exam=${selectedExam}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudentsGrades(data.students_grades);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedYear, selectedExam]);

  // Get unique classes for filter
  const classes = [...new Set(studentsGrades.map(student => student.class_name))];
  useEffect(() => {
    if (classes.length > 0) setSelectedClass(classes[0]);
  }, [studentsGrades]);

  // Filter students based on search and class selection
  const filteredStudents = studentsGrades.filter(student => {
    const matchesSearch = student.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !selectedClass || student.class_name === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading grades...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Students Grades</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-4 items-end">
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
          <div className='min-w-28'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {exams.map(exam => (
                <option key={exam.name} value={exam.name}>{exam.name}</option>
              ))}
            </select>
          </div>
          <div className='min-w-28'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div 
            key={student.student_id} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{student.student_name}</h3>
                <p className="text-sm text-gray-600">{student.class_name}</p>
              </div>
            </div>

            {/* Grades Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Grades</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left text-sm text-gray-500">Subject</th>
                      <th className="p-2 text-left text-sm text-gray-500">Teacher</th>
                      <th className="p-2 text-left text-sm text-gray-500">Exam</th>
                      <th className="p-2 text-left text-sm text-gray-500">Score</th>
                      <th className="p-2 text-left text-sm text-gray-500">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.grades.map((grade, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{grade.subject_name}</td>
                        <td className="px-2 py-1">{grade.teacher_name}</td>
                        <td className="px-2 py-1">{grade.exam_name}</td>
                        <td className="px-2 py-1">{grade.score}</td>
                        <td className="px-2 py-1">{grade.letter_grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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