"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";

const COW_DAIRY_LOGO = "/utl-logo.png";
const navigationItems = [
    // Main routes
    { name: 'Dashboard', path: '/dashboard/admin', category: 'Main', icon: '🏠' },
    { name: 'Helpdesk', path: '/helpdesk-customer-ticket', category: 'Helpdesk', icon: '❓' },
    { name: 'Analysis', path: '/analysis', category: 'Analysis', icon: '📊' },
];

const AppHeader: React.FC = () => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof navigationItems>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const router = useRouter();

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };
    const inputRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Search functionality
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length > 0) {
            const filtered = navigationItems.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase()) ||
                item.path.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 8)); // Limit to 8 results
            setIsSearchOpen(true);
        } else {
            setSearchResults([]);
            setIsSearchOpen(false);
        }
    };

    const handleSearchItemClick = (path: string) => {
        router.push(path);
        setSearchQuery('');
        setSearchResults([]);
        setIsSearchOpen(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsSearchOpen(false);
            setSearchQuery('');
            inputRef.current?.blur();
        } else if (e.key === 'Enter' && searchResults.length > 0) {
            handleSearchItemClick(searchResults[0].path);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setApplicationMenuOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
                setApplicationMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, []);

    return (
        <header className="sticky top-0 flex w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-40 shadow-sm">
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                {/* Mobile Layout */}
                <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:hidden">
                    <button
                        className="flex shrink-0 items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl z-50 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                        onClick={handleToggle}
                        aria-label="Toggle Sidebar"
                    >
                        {/* Burger/Close Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>

                    <Link href="/">
                        <div className="flex items-center justify-center gap-3">
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                                <Image
                                    fill
                                    className="rounded-lg shadow-sm object-cover"
                                    src={COW_DAIRY_LOGO}
                                    alt="Logo"
                                />
                            </div>
                            <span className="hidden sm:block text-white font-semibold text-lg text-emerald-400">UTL Helpdesk</span>
                        </div>
                    </Link>

                    <button
                        onClick={toggleApplicationMenu}
                        className="flex shrink-0 items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl z-50 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                        {/* User/Menu Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isApplicationMenuOpen && (
                    <div ref={mobileMenuRef} className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl lg:hidden p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Mobile Search */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            {/* Mobile Search Results */}
                            {isSearchOpen && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {searchResults.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearchItemClick(item.path)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.category}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Theme</span>
                            <ThemeToggleButton />
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                    <Image src={COW_DAIRY_LOGO} alt="User" fill className="object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">User</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">user@example.com</span>
                                </div>
                            </div>
                            <Link href="/settings" className="text-sm text-emerald-600 font-medium">Settings</Link>
                        </div>
                    </div>
                )}

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between w-full py-4">
                    {/* Left side - Menu button */}
                    <button
                        className="flex items-center justify-center w-11 h-11 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl z-50 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                        onClick={handleToggle}
                        aria-label="Toggle Sidebar"
                    >
                        {/* Burger Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>

                    {/* Center - Search Bar */}
                    <div className="flex-1 max-w-md mx-8">
                        <div ref={searchRef} className="relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search pages..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => searchQuery && setIsSearchOpen(true)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all duration-200"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {isSearchOpen && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                                    <div className="p-2">
                                        {searchResults.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSearchItemClick(item.path)}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {item.category}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - User area */}
                    {/* Desktop User Area */}
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="relative">
                            <ThemeToggleButton />
                        </div>
                        <div className="relative">
                            <UserDropdown />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
