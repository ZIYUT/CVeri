'use client';

import React from 'react';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-300 dark:to-indigo-200">
          About CVeri
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Revolutionizing resume verification through blockchain technology
        </p>
      </div>

      <div className="space-y-16">
        {/* Our Mission - Full Width */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            At CVeri, we're committed to creating a trusted ecosystem for professional credentials.
            Our blockchain-powered platform allows individuals to securely store their professional
            experiences while enabling employers and educational institutions to verify these
            credentials with confidence.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            We believe in a world where verification of professional and educational achievements is
            transparent, immutable, and accessible—eliminating fraud and streamlining the hiring
            process.
          </p>
        </div>

        {/* Become a Certifier - Full Width */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Become a Certifier
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We welcome organizations and institutions to join CVeri as authorized certifiers. As a
            certifier, you'll have the ability to verify and authenticate professional experiences
            on our platform.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Currently, CVeri is in beta testing, and the certifier registration process is limited.
            To become a certifier at this stage, please contact our development team directly using
            the information below. We will guide you through the verification process.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We plan to open a public certifier application portal in the future when the platform
            launches officially. We appreciate your understanding regarding this temporary
            limitation.
          </p>

          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Contact Us:</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Ziyu Tian:</p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="inline-block w-20">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/ziyu-tian-030b51139/"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  linkedin.com/in/ziyu-tian-030b51139/
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="inline-block w-20">Email:</span>
                <a
                  href="mailto:tianziyu98@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  tianziyu98@gmail.com
                </a>
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Lingyue Zhuo:</p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="inline-block w-20">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/dylanzhuo/"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  linkedin.com/in/dylanzhuo/
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="inline-block w-20">Email:</span>
                <a
                  href="mailto:dylanzhuo6@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  dylanzhuo6@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Combined Open Source Project with Technology - Full Width */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Open Source Project
          </h2>

          {/* Technology content moved here */}
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Technology</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our platform leverages the power of blockchain technology to create tamper-proof records
            of professional experiences and academic achievements. By using smart contracts, we
            ensure that once a credential is certified by an authorized institution, it cannot be
            altered or falsified.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Each resume entry is cryptographically hashed and stored on the blockchain, allowing for
            secure and verifiable sharing of professional information.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
            Project Access
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            CVeri is an open source project hosted on GitHub. We welcome contributions, feedback,
            and suggestions for improving our software development.
          </p>

          <div className="mb-6">
            <p className="font-medium mb-2 text-gray-800 dark:text-white">GitHub Repository:</p>
            <a
              href="https://github.com/ZIYUT/CVeri"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-md flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <span className="font-mono">github.com/ZIYUT/CVeri</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We welcome you to deploy CVeri locally for your personal or organizational use. However,
            please note that we maintain intellectual property rights to the codebase, and it may
            not be used for commercial purposes without explicit permission.
          </p>

          {/* Added new paragraph about contact */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you have any questions about the project, or have constructive suggestions for
            improvement, please don't hesitate to reach out using the contact information provided
            above. We greatly welcome collaboration and feedback from the community.
          </p>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-gray-600 dark:text-gray-300 text-sm italic">
              © 2025 CVeri. All rights reserved. This project is licensed for non-commercial use
              only. For deployment questions or development suggestions, please contact our team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
