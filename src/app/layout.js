import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
    title: 'Resume DApp',
    description: 'Verify and register resumes on-chain',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="m-0 font-sans bg-gradient-to-br from-purple-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <Navbar />
        <main className="relative isolate min-h-screen flex flex-col">
            {/* Decorative background shapes */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-100px] left-[-100px] h-[500px] w-[500px] bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-100px] right-[-100px] h-[500px] w-[500px] bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
            </div>

            <div className="flex-grow px-6 py-12 max-w-7xl mx-auto w-full">
                {children}
            </div>

            <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
                <p>CVeri • Resume Verification System</p>
                <p className="mt-1">Secured by Blockchain Technology</p>
            </footer>
        </main>
        </body>
        </html>
    );
}
