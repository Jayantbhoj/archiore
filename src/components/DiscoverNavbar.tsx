"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SearchBox from './Searchbox';
import { motion } from 'framer-motion';  // Import motion from Framer Motion

const DiscoverNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const searchBoxRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const router= useRouter();   
    useEffect(() => {
        const existingQuery = searchParams.get("q");
        if (existingQuery) {
            setQuery(existingQuery);
        }
    }, [searchParams]);

    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);
    const searchIconClick = () => setIsSearchVisible(prev => !prev);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (searchBoxRef.current && target && !searchBoxRef.current.contains(target) && !target.closest('.search-icon')) {
                setIsSearchVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
        return isOpen ? "flex absolute top-[60px] bg-myWhite w-full p-10 left-0 gap-5 flex-col" : "hidden md:flex gap-x-5";
    }
    useEffect(() => {
        const existingQuery = searchParams.get("query");
        if (existingQuery) {
            setQuery(existingQuery);
        }
    }, [searchParams]);
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (query.trim()) {
                router.push(`/home/search?q=${encodeURIComponent(query)}`);
            }
        }
    };

    const linkClasses = (path: string) => 
        `mx-2 p-2 ${pathname === path ? 'border-b-2 border-myBlack text-myBlack' : ''} 
        hover:border-b-2 hover:border-myBlack hover:text-myBlack`;

    const linkAnimation = {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        whileHover: { scale: 1, transition: { duration: 0.2 } },
        whileTap: { scale: 0.9 },
        transition: { duration: 0.3 },
    };

    if (pathname === '/signin' || pathname === '/signup') {
        return null;
    }

    return (
        <nav className={`sticky top-0 z-50 bg-myWhite text-myWhite p-4 sm:p-6 md:flex md:justify-around md:items-center transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
            <div className='text-myBlack font-bold container ml-* flex justify-between items-center'>
            <a href='/' className='text-2xl font-bold'>
                        {/* Large Screen Logo */}
                        <img 
                            src='/logo-large.png' 
                            alt='Logo' 
                            className='hidden sm:block w-[110px] h-[45px]'  // This logo is hidden on small screens
                        />
                        
                        {/* Small Screen Logo */}
                        <img 
                            src='logosmall.png' 
                            alt='Logo' 
                            className='sm:hidden block w-[40px] h-[40px]'  // This logo is hidden on large screens
                        />
                    </a>

                <div className={getMenuClasses()} ref={menuRef}>
                    {/* Wrap Links with motion.div for animation */}
                    <motion.div 
                        className={linkClasses('/')}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        whileTap="whileTap"
                        variants={linkAnimation}>
                        <Link href="/" onClick={closeMenu}>Home</Link>
                    </motion.div>
                    <motion.div 
                        className={linkClasses('/discover')}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        whileTap="whileTap"
                        variants={linkAnimation}>
                        <Link href="/explore" onClick={closeMenu}>Discover</Link>
                    </motion.div>
                    <motion.div 
                        className={linkClasses('/upload')}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        whileTap="whileTap"
                        variants={linkAnimation}>
                        <Link href="/upload" onClick={closeMenu}>Upload</Link>
                    </motion.div>
                </div>


                               {/* Search Box */}
                               <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch} // ✅ Added event listener
                        className="w-[250px] sm:w-[350px] md:w-[600px] p-3 h-11 pl-10 border-none hover:bg-[#dcdcdc] rounded-3xl bg-[#f1f1f1] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-myBlack text-black"
                    />
                    {/* Search Icon Inside the Input Box */}
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" className="absolute  opacity-40 left-3 top-1/2 transform -translate-y-1/2">
                        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                    </svg>
                </div>

                <div className='text-myWhite'>

                        <>
                            <Link href="/signin" className='mx-2 bg-[#f5f5f5] text-myRed border-2 border-myRed px-3 py-1.5 rounded-md'>Log in</Link>
                            <Link href="/signup" className='mx-2 bg-myRed text-white px-3 border-2 border-myRed py-1.5 rounded-md'>Sign up</Link>
                        </>

                </div>

                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="hamburger-icon">
                        <svg viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" stroke="#000000" width="24" height="24">
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
        </nav>
    );
};

export default DiscoverNavbar;
