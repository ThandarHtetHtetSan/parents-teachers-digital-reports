'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ParentAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parent = localStorage.getItem('parent');
    if (!parent) {
      router.push('/login');
      return;
    }
    fetch(`http://127.0.0.1:5000/announcements?role_name=parent`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnnouncements(data.announcements);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter announcements based on search and filters
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Announcements</h1>
        <div className="flex-1 pl-20">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4 mt-10">
        {filteredAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-700">{announcement.title}</h3>
              </div>
              <span className="text-sm text-gray-500">
                {announcement.date ? new Date(announcement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
              </span>
            </div>
            <p className="text-gray-600">{announcement.description}</p>
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}