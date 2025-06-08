'use client';
import { useState } from 'react';

export default function PrincipalAnnouncements() {
  // Mock data - replace with API calls
  const announcements = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      description: 'Annual parent-teacher meeting scheduled for next week. Please make sure to attend to discuss your child\'s progress.',
      date: '2025-05-20',
      type: 'Meeting',
      priority: 'High',
      status: 'Published'
    },
    {
      id: 2,
      title: 'School Holiday',
      description: 'School will be closed for spring break from May 25th to May 30th. Classes will resume on June 1st.',
      date: '2025-05-15',
      type: 'Holiday',
      priority: 'Medium',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Sports Day',
      description: 'Annual sports day will be held on June 5th. Parents are invited to attend and support their children.',
      date: '2025-05-10',
      type: 'Event',
      priority: 'Medium',
      status: 'Draft'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  // Get unique types and priorities for filters
  const types = [...new Set(announcements.map(announcement => announcement.type))];
  const priorities = [...new Set(announcements.map(announcement => announcement.priority))];

  // Filter announcements based on search and filters
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || announcement.status === selectedStatus;
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  // Sort announcements by date (newest first)
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Announcements</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200"
        >
          Create Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Announcements List */}
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
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  announcement.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {announcement.status}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-sky-600 hover:text-sky-700">Edit</button>
                {announcement.status === 'Draft' && (
                  <button className="text-green-600 hover:text-green-700">Publish</button>
                )}
                <button className="text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{announcement.description}</p>
            <div className="text-sm text-gray-500">
              {new Date(announcement.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        ))}

        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Announcement Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Announcement</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter announcement description"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                    <option value="Meeting">Meeting</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
                >
                  Create Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 