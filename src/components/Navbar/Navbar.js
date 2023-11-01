import React from 'react';
import Wallet from './Wallet.js';
import Link from 'next/link'; 

export default function Navbar({ sessionInProgress }) {

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
            {/* Left side - App Name */}
            <div className="text-white text-xl font-bold">consultX</div>

            {/* Middle side - Links */}
            <div className="hidden md:flex space-x-4">
                {sessionInProgress ? (
                    // Render a disabled link when the session is in progress
                    <span className="text-gray-400">Home</span>
                ) : (
                    // Render the link when there's no active session
                    <a href="/" className="text-white hover:text-blue-200">Home</a>
                )}
                {sessionInProgress ? (
                    // Render a disabled link when the session is in progress
                    <span className="text-gray-400">Create Session</span>
                ) : (
                    // Render the link when there's no active session
                    <Link href="/createsession" className="text-white hover:text-blue-200">
                        Create Session
                    </Link>
                )}
            </div>

            {/* Right side - Connect Wallet Button */}
            <Wallet />
        </nav>
    );
}
