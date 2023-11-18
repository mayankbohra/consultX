'use client'
import React, { useState } from 'react';
import Wallet from './Wallet.js';
import Link from 'next/link';

export default function Navbar({ sessionInProgress }) {
    const [homeHovered, setHomeHovered] = useState(false);
    const [createSessionHovered, setCreateSessionHovered] = useState(false);

    const homeLinkStyles = {
        color: homeHovered ? '#FF9800' : '#FFF',
        fontWeight: 'bold',
        transition: 'color 0.3s',
        textDecoration: 'none',
    };

    const createSessionLinkStyles = {
        color: createSessionHovered ? '#FF9800' : '#FFF',
        fontWeight: 'bold',
        transition: 'color 0.3s',
        textDecoration: 'none', 
    };

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className="text-white text-xl font-bold">consultX</div>

            <div className="hidden md:flex space-x-4">
                {sessionInProgress ? (
                    <span className="text-gray-400">Home</span>
                ) : (
                    <div
                        onMouseEnter={() => setHomeHovered(true)}
                        onMouseLeave={() => setHomeHovered(false)}
                    >
                        <Link href="/">
                            <span style={homeLinkStyles}>Home</span>
                        </Link>
                    </div>
                )}
                {sessionInProgress ? (
                    <span className="text-gray-400">Create Session</span>
                ) : (
                    <div
                        onMouseEnter={() => setCreateSessionHovered(true)}
                        onMouseLeave={() => setCreateSessionHovered(false)}
                    >
                        <Link href="/createsession">
                            <span style={createSessionLinkStyles}>Create Session</span>
                        </Link>
                    </div>
                )}
            </div>
            <Wallet />
        </nav>
    );
}
