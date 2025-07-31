'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ParentGrades() {
  const router = useRouter();
  const [grades, setGrades] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parent = localStorage.getItem('parent');
    if (!parent) {
      router.push('/login');
      return;
    }
    const parentObj = JSON.parse(parent);
    fetch(`http://127.0.0.1:5000/parents/grades?parent_id=${parentObj.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGrades(data.grades);
          // Set default year filter to latest year
          if (data.grades.length) {
            setSelectedYear(data.grades[0].year);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get unique years and exam names for filters
  const years = [...new Set(grades.map(grade => grade.year))];
  const examNames = [...new Set(grades.map(grade => grade.exam_name))];

  // Filter grades based on selected filters
  const filteredGrades = grades.filter(grade => {
    const yearMatch = grade.year === selectedYear;
    const examMatch = selectedExam === 'all' || grade.exam_name === selectedExam;
    return yearMatch && examMatch;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading grades...</div>;
  }

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGrades.map((grade, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.exam_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      grade.grade === 'A' ? 'bg-green-100 text-green-800' :
                      grade.grade === 'A-' ? 'bg-green-50 text-green-700' :
                      grade.grade === 'B+' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {grade.letter_grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.year}
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