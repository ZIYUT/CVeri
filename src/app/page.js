'use client';

import './globals.css';
import { useState } from 'react';

export default function Home() {
  const [clicked, setClicked] = useState(false);

  return (
    <main
      className="min-h-screen flex items-center justify-center transition-colors duration-500
      bg-gradient-to-br from-purple-50 via-white to-blue-100
      dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black"
    >
      <div className="text-center px-6 py-12 max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 dark:text-white">
          Welcome to <span className="text-purple-600 dark:text-purple-400">CVeri</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Empowering companies and individuals to verify professional experiences securely and
          transparently using{' '}
          <span className="font-medium text-purple-600 dark:text-purple-300">Web3 technology</span>.
        </p>
        <button
          onClick={() => setClicked(!clicked)}
          className="mt-4 inline-block px-8 py-3 text-lg font-semibold bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          {clicked ? 'Thanks for exploring!' : 'Explore the DApp'}
        </button>
      </div>
    </main>
  );
}
