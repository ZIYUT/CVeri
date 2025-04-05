'use client';

import Link from 'next/link';

export default function Home() {
  return (
      <div className="relative isolate overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute left-[-120px] top-20 h-96 w-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>
        <div className="absolute right-[-120px] bottom-10 h-96 w-96 bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>

        {/* Main content */}
        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
          <section className="text-center max-w-4xl space-y-8 animate-fade-in">
            <h1 className="text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-300 dark:to-indigo-200">
              Welcome to CVeri
            </h1>
            <p className="text-xl leading-relaxed">
              A cutting-edge Web3 platform for authenticating resumes and credentials on the blockchain.
            </p>
            <p className="text-md leading-relaxed">
              CVeri empowers individuals and organizations to securely store, verify, and certify professional experiences using Polygon blockchain and IPFS.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
              <Link href="/verifyCV">
                <button className="px-6 py-3 text-lg font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                  🔍 Verify Resume
                </button>
              </Link>
              <Link href="/SubmitCV">
                <button className="px-6 py-3 text-lg font-semibold rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                  ✍️ Submit Resume
                </button>
              </Link>
              <Link href="/CertifyCV">
                <button className="px-6 py-3 text-lg font-semibold rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                  ✅ Certify Resume
                </button>
              </Link>
            </div>
          </section>

          <section className="mt-20 max-w-5xl text-left space-y-6 text-base leading-relaxed px-4 animate-fade-in delay-200">
            <h2 className="text-3xl font-bold text-center mb-6">
              Why Resume Verification Matters
            </h2>
            <p>
              In a job market where competition is fierce and resume inflation is widespread, hiring decisions must be informed by reliable data.
              CVeri leverages blockchain’s immutability and IPFS’s decentralized storage to ensure that every resume entry is provable, tamper-resistant, and owned by its rightful creator.
            </p>
            <p>
              By streamlining the verification process, we reduce friction for HR teams, minimize fraud risk, and create a fairer hiring ecosystem for candidates.
            </p>
            <p>
              Join us in transforming recruitment through trust, transparency, and technology.
            </p>
          </section>
        </main>
      </div>
  );
}