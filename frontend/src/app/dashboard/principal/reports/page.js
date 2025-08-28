'use client';
import { useEffect, useState } from 'react';

export default function PrincipalReports() {
  const [loading, setLoading] = useState(true);
  const [gradeGroups, setGradeGroups] = useState([]);
  const [approving, setApproving] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:5000/principal/reports')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGradeGroups(data.data.grade_groups);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleApprove = async (groupKey) => {
    setApproving(prev => ({ ...prev, [groupKey]: true }));
    await fetch('http://127.0.0.1:5000/principal/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_key: groupKey }),
    });
    // Refetch data to update UI
    fetch('http://127.0.0.1:5000/principal/reports')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGradeGroups(data.data.grade_groups);
        }
        setApproving(prev => ({ ...prev, [groupKey]: false }));
      });
  };

  const toggleExpand = (groupKey) => {
    setExpanded(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Principal Reports Approval</h1>

      <div>
        {gradeGroups.length === 0 ? (
          <div className="text-gray-500">No grade reports to approve.</div>
        ) : (
          gradeGroups.map((group, gp_idx) => (
            <div key={gp_idx} className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-center">
                <div
                  className="flex items-center cursor-pointer font-semibold text-gray-600"
                  onClick={() => toggleExpand(group.groupKey)}
                >
                  <span className="mr-2">
                    {expanded[group.groupKey] ? '▼' : '▶'}
                  </span>
                  <span className="mr-2">{group.subject_name}</span> | 
                  <span className="mx-2">{group.teacher_name}</span> | 
                  <span className="mx-2">{group.exam_name}</span> | 
                  <span className="mx-2">{group.year}</span>
                </div>
                <button
                  disabled={group.approved || approving[group.groupKey]}
                  onClick={() => handleApprove(group.groupKey)}
                  className={`px-4 py-2 rounded-lg font-medium ${group.approved ? 'bg-green-100 text-green-700' : 'bg-sky-600 text-white cursor-pointer hover:bg-sky-700'}`}
                >
                  {group.approved ? 'Approved' : (approving[group.groupKey] ? 'Approving...' : 'Approve')}
                </button>
              </div>
              {expanded[group.groupKey] && (
                <table className="w-full mt-4">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left text-gray-500">Student</th>
                      <th className="p-2 text-left text-gray-500">Score</th>
                      <th className="p-2 text-left text-gray-500">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.students.map((stu, stu_idx) => (
                      <tr key={stu_idx}>
                        <td className="px-2 py-1">{stu.student_name}</td>
                        <td className="px-2 py-1">{stu.score}</td>
                        <td className="px-2 py-1">{stu.letter_grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}