import './globals.css';
import Navbar from '../components/Navbar'; // assuming you put the component here

export const metadata = {
    title: 'Resume DApp',
    description: 'Verify and register resumes on-chain',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="m-0 font-sans">
        <Navbar />
        <main className="p-8">{children}</main>
        </body>
        </html>
    );
}
