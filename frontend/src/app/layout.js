// src/app/layout.js
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Login System',
  description: 'Hybrid RBAC Login Page',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              fontSize: '0.875rem',
              fontWeight: '500',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              border: '1px solid #e2e8f0',
              maxWidth: '400px',
            },
            success: {
              iconTheme: {
                primary: '#0ea5e9',
                secondary: '#fff',
              },
              style: {
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
              },
            },
            loading: {
              iconTheme: {
                primary: '#0ea5e9',
                secondary: '#fff',
              },
              style: {
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}

