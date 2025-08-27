'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // if (!res.ok) {
      //   const text = await res.text();
      //   console.error("Raw response:", text);
      //   toast.error("Failed to connect to server or bad response");
      //   return;
      // }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        toast.success(`Welcome, ${data.user.full_name}!`);
        // Redirect based on role using Next.js router
        switch (data.user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'teacher':
            localStorage.setItem('teacher', JSON.stringify(data.user));
            router.push('/dashboard/teacher');
            break;
          case 'parent':
            localStorage.setItem('parent', JSON.stringify(data.user));
            router.push('/dashboard/parent');
            break;
          case 'principal':
            router.push('/dashboard/principal');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    } finally {
      setIsLoading(false);
    }
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
      <form onSubmit={handleLogin} className="bg-white/50 p-8 rounded-xl shadow-lg w-full max-w-lg border border-sky-100">
        <h1 className="text-3xl font-bold mb-6 text-sky-600 text-center">Welcome Back</h1>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-400' 
                  : 'border-sky-200'
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all ${
                errors.password 
                  ? 'border-red-300 focus:ring-red-400' 
                  : 'border-sky-200'
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <button 
            type="submit" 
            className={`w-full bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}



