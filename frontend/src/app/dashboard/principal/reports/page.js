'use client';
import { useState } from 'react';

export default function PrincipalReports() {
  // Mock data - replace with API calls
  const classes = [
    { id: 1, name: 'Grade 5A', teacher: 'Mrs. Johnson', students: 30 },
    { id: 2, name: 'Grade 5B', teacher: 'Mr. Smith', students: 28 },
    { id: 3, name: 'Grade 4A', teacher: 'Ms. Williams', students: 32 },
    { id: 4, name: 'Grade 4B', teacher: 'Mr. Brown', students: 29 }
  ];

  const reports = [
    {
      id: 1,
      classId: 1,
      type: 'Grades',
      term: 'First Term',
      date: '2025-05-27',
      status: 'Published',
      publishedBy: 'Principal'
    },
    {
      id: 2,
      classId: 1,
      type: 'Attendance',
      term: 'May 2025',
      date: '2025-05-26',
      status: 'Published',
      publishedBy: 'Principal'
    },
    {
      id: 3,
      classId: 2,
      type: 'Grades',
      term: 'First Term',
      date: '2025-05-25',
      status: 'Draft',
      publishedBy: 'Principal'
    }
  ];

  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter reports based on selections
  const filteredReports = reports.filter(report => {
    const classMatch = selectedClass === 'all' || report.classId === parseInt(selectedClass);
    const typeMatch = selectedType === 'all' || report.type === selectedType;
    const statusMatch = selectedStatus === 'all' || report.status === selectedStatus;
    return classMatch && typeMatch && statusMatch;
  });

  // Get class name by ID
  const getClassName = (classId) => {
    const classInfo = classes.find(c => c.id === classId);
    return classInfo ? classInfo.name : 'Unknown Class';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Class Reports</h1>
        <button 
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200"
        >
          Generate New Report
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
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Grades">Grades</option>
            <option value="Attendance">Attendance</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getClassName(report.classId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.term}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button className="text-sky-600 hover:text-sky-700">View</button>
                      {report.status === 'Draft' && (
                        <button className="text-green-600 hover:text-green-700">Publish</button>
                      )}
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
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