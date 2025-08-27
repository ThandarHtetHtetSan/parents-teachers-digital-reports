'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherGrades() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Add New Grade form states
  const [newGradeData, setNewGradeData] = useState({
    selectedClass: '',
    selectedSubject: '',
    selectedExam: '',
    selectedYear: new Date().getFullYear().toString(),
    grades: {}
  });

  useEffect(() => {
    const teacher = localStorage.getItem('teacher');
    if (!teacher) {
      router.push('/login');
      return;
    }
    const teacherObj = JSON.parse(teacher);

    // Fetch grades data
    fetch(`http://127.0.0.1:5000/teachers/grades?teacher_id=${teacherObj.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGrades(data.grades);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch classes data
    fetch(`http://127.0.0.1:5000/teachers/classes?teacher_id=${teacherObj.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClasses(data.classes);
          // Set first class as default
          if (data.classes.length > 0) {
            const firstClass = data.classes[0];
            setSelectedClass(`${firstClass.class_name} - ${firstClass.subject_name}`);
            setNewGradeData(prev => ({
              ...prev,
              selectedClass: `${firstClass.class_name} - ${firstClass.subject_name}`,
              selectedSubject: firstClass.subject_name
            }));
          }
        }
      })
      .catch(() => {});

    // Fetch exams data
    fetch(`http://127.0.0.1:5000/exams`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExams(data.exams);
          setSelectedExam(data.exams[0].name);
        }
      })
      .catch(() => {});
  }, []);

  // Filter grades based on selections
  const filteredGrades = grades.filter(grade => {
    const classMatch = !selectedClass || 
      `${grade.class_name} - ${grade.subject_name}` === selectedClass;
    const examMatch = !selectedExam || grade.exam_name === selectedExam;
    const yearMatch = !selectedYear || grade.year === parseInt(selectedYear);
    return classMatch && examMatch && yearMatch;
  });

  // Get students for selected class in Add New Grade form
  const selectedClassData = classes.find(cls => 
    `${cls.class_name} - ${cls.subject_name}` === newGradeData.selectedClass
  );

  const handleGradeChange = (studentId, field, value) => {
    const isScore = field === 'score';
    let grade = '';
    if (isScore) {
      if (value < 0 || value > 100) {
        alert('Score must be between 0 and 100.');
        return;
      }
      grade = value >= 80 ? 'A' : value >= 70 ? 'B' : value >= 60 ? 'C' : value >= 50 ? 'D' : value >= 40 ? 'E' : 'F';
    }
    setNewGradeData(prev => ({
      ...prev,
      grades: {
        ...prev.grades,
        [studentId]: {
          ...prev.grades[studentId],
          [field]: value,
          grade: isScore ? grade : prev.grades[studentId]?.grade || ''
        }
      }
    }));
  };

  const handleSubmitGrades = async () => {
    try {
      const teacher = localStorage.getItem('teacher');
      if (!teacher) {
        alert('Teacher session not found. Please login again.');
        return;
      }
      const teacherObj = JSON.parse(teacher);

      const response = await fetch('http://127.0.0.1:5000/teachers/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherObj.id,
          grade_data: newGradeData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        // Reset form
        setNewGradeData(prev => ({
          ...prev,
          grades: {}
        }));
        setIsAddingNew(false);
        
        // Refresh grades data
        const gradesResponse = await fetch(`http://127.0.0.1:5000/teachers/grades?teacher_id=${teacherObj.id}`);
        const gradesData = await gradesResponse.json();
        if (gradesData.success) {
          setGrades(gradesData.grades);
        }
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Failed to save grades. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading grades...</div>;
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {classes.map(cls => (
                <option key={`${cls.class_id}_${cls.subject_id}`} value={`${cls.class_name} - ${cls.subject_name}`}>
                  {cls.class_name} - {cls.subject_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {exams.map(exam => (
                <option key={exam.id} value={exam.name}>{exam.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {Array.from({ length: 3 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return year.toString();
              }).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add New Grades Form */}
      {isAddingNew && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Grades</h2>
          
          {/* Selection Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={newGradeData.selectedClass}
                onChange={(e) => {
                  const [className, subjectName] = e.target.value.split(' - ');
                  setNewGradeData(prev => ({
                    ...prev,
                    selectedClass: e.target.value,
                    selectedSubject: subjectName
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {classes.map(cls => (
                  <option key={`${cls.class_id}_${cls.subject_id}`} value={`${cls.class_name} - ${cls.subject_name}`}>
                    {cls.class_name} - {cls.subject_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
              <select
                value={newGradeData.selectedExam}
                onChange={(e) => setNewGradeData(prev => ({ ...prev, selectedExam: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.name}>{exam.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={newGradeData.selectedYear}
                onChange={(e) => setNewGradeData(prev => ({ ...prev, selectedYear: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {Array.from({ length: 3 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return year.toString();
                }).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Students List */}
          {selectedClassData && (
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
                  {selectedClassData.students.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newGradeData.grades[student.student_id]?.score || ''}
                          onChange={(e) => handleGradeChange(student.student_id, 'score', parseInt(e.target.value) || '')}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {newGradeData.grades[student.student_id]?.grade || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Add remark"
                          value={newGradeData.grades[student.student_id]?.remark || ''}
                          onChange={(e) => handleGradeChange(student.student_id, 'remark', e.target.value)}
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
          {selectedClassData && newGradeData.selectedExam && newGradeData.selectedYear && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmitGrades}
                disabled={Object.keys(newGradeData.grades).length === 0}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.student_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.class_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.subject_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.exam_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.score}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sky-600">{grade.letter_grade}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{grade.remark || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No grades found.
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