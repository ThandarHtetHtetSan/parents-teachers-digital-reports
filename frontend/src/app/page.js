'use client'
import { useRouter } from 'next/navigation';

const roles = [
  {
    name: 'Admin',
    color: 'bg-red-100/50 text-red-700',
    icon: (
      // Shield Check
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V7l8-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    name: 'Parent',
    color: 'bg-sky-100/50 text-sky-700',
    icon: (
      // User Group
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
  },
  {
    name: 'Principal',
    color: 'bg-green-100/50 text-green-700',
    icon: (
      // Academic Cap
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0l-3-3m3 3l3-3"/>
      </svg>
    ),
  },
  {
    name: 'Teacher',
    color: 'bg-purple-100/50 text-purple-700',
    icon: (
      // Pencil Square
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"/>
      </svg>
    ),
  },
];

export default function Home() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push('/login');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
      style={{
        backgroundImage: "url('/main-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white/50 w-full md:max-w-4xl rounded-2xl px-8 pt-12 pb-16 shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-sky-700 mb-12">Digital Report</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
          {roles.map(role => (
            <button
              key={role.name}
              onClick={handleCardClick}
              className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-md hover:shadow-xl transition ${role.color} cursor-pointer hover:bg-opacity-80`}
            >
              {role.icon}
              <span className="mt-4 text-xl font-semibold">{role.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}