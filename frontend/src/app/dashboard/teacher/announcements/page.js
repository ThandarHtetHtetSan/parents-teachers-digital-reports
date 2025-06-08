'use client';
import { useState } from 'react';

export default function TeacherAnnouncements() {
  // Mock data - replace with API calls
  const teacherInfo = {
    id: 1,
    name: 'Mrs. Johnson',
    classes: [
      { id: 1, name: 'Grade 5A', subject: 'Mathematics' },
      { id: 2, name: 'Grade 5B', subject: 'Science' }
    ]
  };

  const announcements = [
    {
      id: 1,
      title: 'Mathematics Test Next Week',
      content: 'There will be a mathematics test covering chapters 5-7 next Monday. Please prepare accordingly.',
      class: 'Grade 5A',
      date: '2024-03-15',
      priority: 'High',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Science Project Deadline',
      content: 'The science project submission deadline has been extended to next Friday. Please ensure all group members contribute equally.',
      class: 'Grade 5B',
      date: '2024-03-14',
      priority: 'Medium',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Parent-Teacher Meeting',
      content: 'Parent-teacher meetings are scheduled for next week. Please ensure your parents are available.',
      class: 'All Classes',
      date: '2024-03-13',
      priority: 'High',
      status: 'Published'
    }
  ];

  const [isCreating, setIsCreating] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    class: '',
    priority: 'Medium'
  });

  // Filter announcements based on selected class and search query
  const filteredAnnouncements = announcements.filter(announcement => {
    const classMatch = !selectedClass || announcement.class === selectedClass;
    const searchMatch = !searchQuery || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    return classMatch && searchMatch;
  });

  const handleCreateAnnouncement = () => {
    // TODO: Implement API call to create announcement
    console.log('Creating announcement:', {
      ...newAnnouncement,
      date: new Date().toISOString().split('T')[0],
      status: 'Published'
    });
    // Reset form
    setNewAnnouncement({
      title: '',
      content: '',
      class: '',
      priority: 'Medium'
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Announcements</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200"
        >
          {isCreating ? 'Cancel' : 'Create Announcement'}
        </button>
      </div>

      {/* Create Announcement Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Create New Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter announcement title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter announcement content"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={newAnnouncement.class}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, class: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">All Classes</option>
                  {teacherInfo.classes.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name} - {cls.subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateAnnouncement}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-800">All Announcements</h2>
          <div className="flex flex-col md:flex-row gap-4">
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
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  announcement.priority === 'High' ? 'bg-red-100 text-red-800' :
                  announcement.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {announcement.priority}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800">
                  {announcement.class}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{announcement.date}</span>
              <span className="text-green-600">{announcement.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 