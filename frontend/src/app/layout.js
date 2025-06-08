// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Login System',
  description: 'Hybrid RBAC Login Page',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

