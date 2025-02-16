'use client';


import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { logoutAction, userDetailsAction } from '@/app/actions';

import DropdownMenu from './Dropdown';


const Navbar = ({ shadow }: { shadow?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<{ username: string; image: string | null } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const searchBoxRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const closeMenu = () => setIsOpen(false);
    const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);
    const [query, setQuery] = useState("");
    const router= useRouter();    
    const searchParams = useSearchParams();


    useEffect(() => {
        const existingQuery = searchParams.get("q");
        if (existingQuery) {
            setQuery(existingQuery);
        }
    }, [searchParams]);


    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (dropdownRef.current && target && !dropdownRef.current.contains(target) && !target.closest('.avatar')) {
                setIsProfileMenuOpen(false);
            }
            if (searchBoxRef.current && target && !searchBoxRef.current.contains(target) && !target.closest('.search-icon')) {
                setIsSearchVisible(false);
            }
            if (menuRef.current && target && !menuRef.current.contains(target) && !target.closest('.hamburger-icon')) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
    const fetchUserDetails = async () => {
        try {
            const details = await userDetailsAction();
            if (details) {
                setUserDetails(details);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    fetchUserDetails();
}, []);
    function getMenuClasses() {
        return isOpen ? "flex absolute top-[60px] bg-myWhite w-full p-10 left-0 gap-5 flex-col" : "hidden md:flex gap-x-5";
    }

    const linkClasses = (path: string) =>
        `mx-2 p-2 ${pathname === path ? 'border-b-2 border-myBlack text-myBlack' : ''}
        hover:border-b-2 hover:border-myBlack hover:text-myBlack`;

    const handleLogout = async () => {
        await logoutAction();
    };


    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (query.trim()) {
                router.push(`/home/search?q=${encodeURIComponent(query)}`);
            }
        }
    };

    const navbarClasses = `sticky top-0 z-50 bg-myWhite text-myBlack p-4 flex justify-around items-center transition-shadow duration-300 w-full ${
        isScrolled ? shadow || '' : ''
    }`;
    

    return (
        <nav className={navbarClasses}>
            <div className='text-myBlack font-bold container flex justify-between items-center gap-5 w-full'>
                {/* Left Section: Logo and Links */}
                <div className="flex items-center gap-5">
                    <a href='/home' className='text-2xl font-bold'>
                        <img
                            src='/logo-large.png'
                            alt='Logo'
                            className='hidden sm:block w-[110px] h-[45px]'
                        />
                        <img
                            src='/logosmall.png'
                            alt='Logo'
                            className='sm:hidden block w-[30px] h-[30px]'
                        />
                    </a>

                    {/* Dropdown Menu for smaller screens */}
                    <div className="block md:hidden">
                        <DropdownMenu />
                    </div>

                    {/* Links for larger screens */}
                    <div className={getMenuClasses()} ref={menuRef}>
                        <div className={linkClasses('/home')}>
                            <Link href="/home" onClick={closeMenu}>Home</Link>
                        </div>
                        <div className={linkClasses('/explore')}>
                            <Link href="/explore" onClick={closeMenu}>Explore</Link>
                        </div>
                        <div className={linkClasses('/upload')}>
                            <Link href="/upload" onClick={closeMenu}>Upload</Link>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch} // ✅ Added event listener
                        className="w-[150px]  sm:w-[350px] md:w-[600px] p-3 sm:h-10 h-8 pl-10 border-none hover:bg-[#dcdcdc] rounded-3xl bg-[#f1f1f1] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-myBlack text-black"
                    />
                    {/* Search Icon Inside the Input Box */}
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30" className="absolute  opacity-40 left-3 top-1/2 transform -translate-y-1/2">
                        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                    </svg>
                </div>

                {/* Avatar and Profile Menu */}
                <div className="relative flex items-center gap-2 ">
    {userDetails && (
        <div>
        <button 
            onClick={toggleProfileMenu} 
            className="avatar flex items-center gap-2 "
        >
            <span className="hidden md:block text-myBlack ">{userDetails.username}</span>
        
            <img
                src={userDetails.image ? userDetails.image : '/noAvatar.png'}  
                alt="User Avatar"
                className="w-8 h-8 rounded-full hover:ring-8 hover:ring-myBlack hover:ring-opacity-20 transition-all duration-300 ease-in-out"
            />
        </button>
        </div>
    )}
    {isProfileMenuOpen && (
        <div ref={dropdownRef} className="absolute top-12 right-0 bg-myWhite shadow-lg rounded-md p-4 z-20 min-w-[200px]">
            <Link href={`/profile/${userDetails!.username}`} className="block py-2 px-4 text-myBlack hover:bg-gray-200 rounded-md transition duration-200 ease-in-out">
                Profile
            </Link>
            <Link href={`/profile/${userDetails!.username}/portfolio`} className="block py-2 px-4 text-myBlack hover:bg-gray-200 rounded-md transition duration-200 ease-in-out">
                Portfolio
            </Link>
            <Link href={'/change-password'} className="block py-2 px-4 text-myBlack hover:bg-gray-200 rounded-md transition duration-200 ease-in-out">
                Change Password
            </Link>
            <button onClick={handleLogout} className="w-full py-2 px-4 text-left text-myBlack hover:bg-gray-200 rounded-md transition duration-200 ease-in-out">
                Logout
            </button>
        </div>
    )}
</div>

            </div>
        </nav>
    );
};

export default Navbar;