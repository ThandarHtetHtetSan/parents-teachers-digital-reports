'use client';
import { useState } from 'react';

export default function ParentAnnouncements() {
  // Mock data - replace with API call
  const announcements = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      description: 'Annual parent-teacher meeting scheduled for next week. Please make sure to attend to discuss your child\'s progress.',
      date: '2025-05-20',
      type: 'Meeting',
      priority: 'High'
    },
    {
      id: 2,
      title: 'School Holiday',
      description: 'School will be closed for spring break from May 25th to May 30th. Classes will resume on June 1st.',
      date: '2025-05-15',
      type: 'Holiday',
      priority: 'Medium'
    },
    {
      id: 3,
      title: 'Sports Day',
      description: 'Annual sports day will be held on June 5th. Parents are invited to attend and support their children.',
      date: '2025-05-10',
      type: 'Event',
      priority: 'Medium'
    },
    {
      id: 4,
      title: 'Exam Schedule',
      description: 'First term examinations will begin from June 10th. Please ensure your child is well prepared.',
      date: '2025-05-05',
      type: 'Academic',
      priority: 'High'
    },
    {
      id: 5,
      title: 'Library Week',
      description: 'Library week will be celebrated from May 15th to May 20th. Students are encouraged to participate in various reading activities.',
      date: '2025-05-01',
      type: 'Event',
      priority: 'Low'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Get unique types and priorities for filters
  const types = [...new Set(announcements.map(announcement => announcement.type))];
  const priorities = [...new Set(announcements.map(announcement => announcement.priority))];

  // Filter announcements based on search and filters
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Announcements</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <div 
            key={announcement.id} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-800">{announcement.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  announcement.priority === 'High' ? 'bg-red-100 text-red-800' :
                  announcement.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {announcement.priority}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                  {announcement.type}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(announcement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <p className="text-gray-600">{announcement.description}</p>
          </div>
        ))}

        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 