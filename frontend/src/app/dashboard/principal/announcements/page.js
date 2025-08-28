'use client';
import { useEffect, useState } from 'react';

export default function PrincipalAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    target_role_id: ''
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/roles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRoles(data.roles);
          setSelectedRole(data.roles[0]?.id || '');
          setForm(f => ({ ...f, target_role_id: data.roles[0]?.id || '' }));
        }
      });
  }, []);

  useEffect(() => {
    const role = roles.find(r => r.id === parseFloat(selectedRole));
    if (!role) return;
    fetch(`http://127.0.0.1:5000/announcements?role_name=${role.name || 'admin'}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnnouncements(data.announcements);
      });
  }, [selectedRole, roles]);

  // Filter announcements by search and role
  const filteredAnnouncements = announcements.filter(a =>
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort by created_at (newest first)
  const sortedAnnouncements = [...filteredAnnouncements].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:5000/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        body: form.body,
        target_role_id: form.target_role_id,
        created_by: 2 // principal id, replace with session if available
      })
    });
    setIsCreating(false);
    setForm({ title: '', body: '', target_role_id: roles[0]?.id || '' });
    // Refetch
    const role = roles.find(r => r.id === parseFloat(selectedRole));
    if (!role) return;
    fetch(`http://127.0.0.1:5000/announcements?role_name=${role.name || 'admin'}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnnouncements(data.announcements);
      });
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setForm(f => ({ ...f, target_role_id: e.target.value }));
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <div 
            key={announcement.id} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{announcement.title}</h3>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(announcement.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <p className="text-gray-600 mb-2">{announcement.body}</p>
          </div>
        ))}

        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Announcement</h2>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  rows="4"
                  placeholder="Enter announcement description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                <select
                  value={form.target_role_id}
                  onChange={e => setForm(f => ({ ...f, target_role_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
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