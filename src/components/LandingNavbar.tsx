"use client";
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

const LandingNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutsideMenu = (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (menuRef.current && target && !menuRef.current.contains(target) && !target.closest('.hamburger-icon')) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutsideMenu);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideMenu);
        }
        return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
    }, [isOpen]);

    function getMenuClasses() {
        return isOpen ? "flex absolute top-[60px] bg-myWhite w-full p-10 left-0 gap-5 flex-col text-myBlack" : "hidden";
    }

    const linkClasses = (path: string) => 
        `mx-2 p-2 relative ${pathname === path ? 'border-b-2 border-myBlack text-myBlack' : 'border-b-2 border-transparent'} 
        hover:border-b-2 hover:border-myBlack hover:text-myBlack`;

    if (pathname === '/signin' || pathname === '/signup') {
        return null;
    }

    return (
        <nav className={`sticky top-0 z-50 bg-myWhite text-myWhite p-4 w-full transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
            <div className='text-myBlack font-bold flex justify-between items-center gap-5 relative'>

                {/* Left Section: Logo */}
                <div className="flex items-center gap-5">
                    <a href='/' className='text-2xl font-bold'>
                        {/* Large Screen Logo */}
                        <img 
                            src='/logo-large.png' 
                            alt='Logo' 
                            className='hidden sm:block w-[110px] h-[45px]'  // This logo is hidden on small screens
                        />
                        
                        {/* Small Screen Logo */}
                        <img 
                            src='/logosmall.png' 
                            alt='Logo' 
                            className='sm:hidden block w-[40px] h-[40px]'  // This logo is hidden on large screens
                        />
                    </a>

                    {/* Links for large screens */}
                    <div className="hidden md:flex gap-x-5">
                        <Link href="/explore" className={linkClasses('/discover')}>Explore</Link>
                        <Link href="/upload" className={linkClasses('/upload')}>Upload</Link>
                    </div>
                </div>

                {/* Right Section: About, Login, Sign Up */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                    <Link href="/about" className={linkClasses('/about')}>About</Link>
                    <Link href="/signin" className='mx-2 bg-[#f5f5f5] text-myRed border-2 border-myRed px-3 py-1.5 rounded-md'>Log in</Link>
                    <Link href="/signup" className='mx-2 bg-myRed text-white px-3 border-2 border-myRed py-1.5 rounded-md'>Sign up</Link>
                </div>

                {/* Hamburger Menu (positioned absolutely on the right) */}
                <div className="md:hidden absolute right-4 top-2 ">
                    <button onClick={toggleMenu} className="hamburger-icon flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" stroke="#000000" width="30" height="30">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                                <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                                <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Items (No animation) */}
            <div className={getMenuClasses()} ref={menuRef}>
                <Link href="/explore" className={linkClasses('/explore')} onClick={closeMenu}>Discover</Link>
                <Link href="/upload" className={linkClasses('/upload')} onClick={closeMenu}>Upload</Link>
                <Link href="/about" className={linkClasses('/about')} onClick={closeMenu}>About</Link>
                <Link href="/signin" className='mx-2 bg-[#f5f5f5] text-myRed border-2 border-myRed px-3 py-1.5 rounded-md' onClick={closeMenu}>Log in</Link>
                <Link href="/signup" className='mx-2 bg-myRed text-white px-3 border-2 border-myRed py-1.5 rounded-md' onClick={closeMenu}>Sign up</Link>
            </div>
        </nav>
    );
};

export default LandingNavbar;
