'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-white dark:bg-black text-black dark:text-white font-semibold uppercase tracking-wide">
      {/* Left: Home Logo */}
      <Link href="/">
        <div className="relative h-8 w-20 overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-250 h-full w-auto cursor-pointer"
          />
        </div>
      </Link>

      {/* Center: Menu links */}
      <div className="flex space-x-8 text-sm">
        <Link
          href="/verifyCV"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          Verify Resume
        </Link>
        <Link
          href="/SubmitCV"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          Submit Resume
        </Link>
        <Link
          href="/CertifyCV"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          Certify Resume
        </Link>
        <Link
          href="/aboutUs"
          className="hover:text-purple-600 dark:hover:text-purple-400 transition"
        >
          About Us
        </Link>
      </div>

      {/* Right: Special button + toggle */}
      <div className="flex items-center space-x-4">
        <Link href="/AdminMode">
          <button className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-80 transition">
            Admin Mode
          </button>
        </Link>

        {/* Theme toggle */}
        <div
            onClick={toggleTheme}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
                isDark ? 'bg-green-500' : 'bg-gray-300'
            }`}
        >
          <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  isDark ? 'translate-x-7' : 'translate-x-0'
              }`}
          />
        </div>
      </div>
    </nav>
  );
}
