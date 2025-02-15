'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();  // Get the current pathname

    const toggleMenu = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Function to convert pathname to page name
    const getPageName = (path: string) => {
        if (path === '/home') return 'Home';
        if (path === '/explore') return 'Explore';
        if (path === '/upload') return 'Upload';
        return 'Menu';  // Default name if no match
    };

    const linkClasses = (path: string) =>
        `block px-4 py-2 text-myBlack hover:bg-gray-200 rounded-md transition duration-200 ${pathname === path ? 'bg-gray-300' : ''}`;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleMenu} 
                className="p-2 bg-myWhite text-myBlack rounded-md"
            >
                {getPageName(pathname)}  {/* Display the dynamic page name */}
                <img src="/icons8-dropdown-50.png" alt="dropdown" className="h-4 w-4 inline ml-1 font-bold" />
            </button>
            
            {isOpen && (
                <div className="absolute mt-2 bg-myWhite shadow-lg rounded-md w-40 z-20">
                     
                    <Link href="/home" className={linkClasses('/home')}>
                        Home
                    </Link>
                    <Link href="/explore" className={linkClasses('/explore')}>
                        Explore
                    </Link>
                    <Link href="/upload" className={linkClasses('/upload')}>
                        Upload
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
