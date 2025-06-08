// 'use client'
// import { useState } from 'react'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [message, setMessage] = useState('')

//   const handleLogin = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setMessage(`✅ Welcome! Role: ${data.role}`)
//         // You can store role/token in localStorage or context here
//       } else {
//         setMessage(`❌ ${data.error}`)
//       }
//     } catch (error) {
//       setMessage('❌ Cannot connect to server')
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-80">
//         <h1 className="text-2xl font-bold mb-6">Login</h1>
//         <input
//           className="border p-2 w-full mb-4"
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="border p-2 w-full mb-4"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button
//           className="bg-blue-500 text-white py-2 px-4 rounded w-full"
//           onClick={handleLogin}
//         >
//           Login
//         </button>
//         {message && <p className="mt-4 text-sm text-center">{message}</p>}
//       </div>
//     </div>
//   )
// }

'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Raw response:", text);
        setMessage("Failed to connect to server or bad response");
        return;
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        setMessage(`Welcome, ${data.user.full_name}! Role: ${data.user.role}`);
        // Redirect based on role (example)
        switch (data.user.role) {
          case 'admin':
            window.location.href = '/dashboard/admin';
            break;
          case 'teacher':
            window.location.href = '/dashboard/teacher';
            break;
          case 'parent':
            window.location.href = '/dashboard/parent';
            break;
          case 'principal':
            window.location.href = '/dashboard/principal';
            break;
          default:
            window.location.href = '/dashboard';
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
}



