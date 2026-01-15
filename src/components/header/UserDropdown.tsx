"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const COW_DAIRY_LOGO = "/utl-logo.png"; // Changed to UTL logo

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState("User");
    const [userEmail, setUserEmail] = useState("user@example.com");

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.dropdown-toggle') && !target.closest('[data-dropdown]')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    const handleSignOut = async () => {
        // Create simple logout logic for now
        console.log("Logging out...");
        // window.location.href = '/signin';
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="dropdown-toggle flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
                <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden relative">
                        <Image
                            src={COW_DAIRY_LOGO}
                            alt="User"
                            fill
                            className="object-contain" // Fixed: Ensure logo is contained
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>

                <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-gray-900 dark:text-white truncate">{userName}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>

                <svg
                    className={`ml-5 stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                        }`}
                    width="16"
                    height="16"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Manual Dropdown Implementation */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 flex w-[280px] flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl z-50"
                >
                    <div data-dropdown className="p-4">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 overflow-hidden">
                                    {/* Fixed: Removed border that might cut off logo and used object-contain */}
                                    <Image
                                        src={COW_DAIRY_LOGO}
                                        alt="User"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="block font-semibold text-gray-900 dark:text-white text-sm">
                                        {userName}
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                        {userEmail || 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>


                        <Link
                            href="/settings"
                            onClick={closeDropdown}
                            className="flex items-center gap-3 px-4 py-3 font-medium text-gray-700 dark:text-gray-300 rounded-xl group text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 ease-out"
                        >
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors duration-200">
                                <svg
                                    className="w-4 h-4 text-emerald-600 dark:text-emerald-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <span className="transition-all duration-200">Profile Settings</span>
                        </Link>

                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                closeDropdown();
                                handleSignOut();
                            }}
                            className="flex items-center gap-3 px-4 py-3 font-medium text-gray-700 dark:text-gray-300 rounded-xl group text-sm hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 ease-out"
                        >
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-200">
                                <svg
                                    className="w-4 h-4 text-red-600 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </div>
                            <span className="transition-all duration-200">Sign Out</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
