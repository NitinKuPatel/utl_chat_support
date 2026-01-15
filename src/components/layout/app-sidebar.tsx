"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
    BoxCubeIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    UserIcon,
    ChatIcon,
    DocsIcon,
    PlugInIcon,
    BellIcon,
    EnvelopeIcon,
    TaskIcon,
    GroupIcon,
    FileIcon,
    FolderIcon,
    PieChartIcon,
    ListIcon,
    TableIcon,
    PageIcon,
    BoltIcon,
    InfoIcon,
    DollarLineIcon,
    CalenderIcon,
    TimeIcon,
} from "@/icons";

const COW_DAIRY_LOGO = "/utl-logo.png"; // Changed to UTL logo

type SubItem = {
    name: string;
    path?: string;
    pro?: boolean;
    new?: boolean;
    type?: 'header';
    icon?: React.ReactNode;
    subItems?: SubItem[]; // Allow nested subItems for dynamic routes
};

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: SubItem[];
    badge?: { text: string; color?: "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" };
};

// Simplified static route mapping based on existing Fujiyama routes
const staticNavItems: NavItem[] = [
    {
        name: 'Dashboard',
        icon: <GridIcon />,
        path: '/dashboard/admin',
    },
    {
        name: 'Helpdesk',
        icon: <TaskIcon />,
        path: '#',
        subItems: [
            { name: 'Settings', path: '/helpdesk-settings' },
            { name: 'Customer Ticket', path: '/helpdesk-customer-ticket' },
            { name: 'Ticket Agents', path: '/helpdesk-ticket-agents' },
        ],
    },
    {
        name: 'Analysis',
        icon: <PieChartIcon />,
        path: '/analysis',
    },
    {
        name: 'Knowledge Base',
        icon: <DocsIcon />,
        path: '/knowledge-base',
    },
    {
        name: 'Chat Dashboard',
        icon: <ChatIcon />,
        path: '/chat-dashboard',
    },
    {
        name: 'Users',
        icon: <UserIcon />,
        path: '/users',
    },
    {
        name: 'TAT Dashboard',
        icon: <TimeIcon />,
        path: '/tat-dashboard',
    },
    {
        name: 'Global Settings',
        icon: <BoltIcon />,
        path: '/settings',
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [navItems, setNavItems] = useState<NavItem[]>(staticNavItems);

    // Track open state of submenus
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Track hydration state
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Handle submenu toggle
    const handleSubmenuToggle = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    // Auto-expand submenu if child is active
    useEffect(() => {
        navItems.forEach(item => {
            if (item.subItems) {
                const hasActiveChild = item.subItems.some(sub => pathname === sub.path);
                if (hasActiveChild) {
                    setOpenSubmenu(item.name);
                }
            }
        });
    }, [pathname, navItems]);

    // Close submenu when sidebar collapses (mouse leave) to prevent hidden state confusion
    useEffect(() => {
        if (!isExpanded && !isHovered && openSubmenu) {
            setOpenSubmenu(null);
        }
    }, [isExpanded, isHovered]);

    if (!isHydrated) return null; // Prevent hydration mismatch

    const renderNavItem = (item: NavItem, index: number) => {
        const isActive = item.path ? pathname === item.path : false;
        const isSubmenuOpen = openSubmenu === item.name;
        const hasSubItems = item.subItems && item.subItems.length > 0;

        // Check if any child is active
        const isChildActive = hasSubItems && item.subItems?.some(sub => pathname === sub.path);

        // Dynamic classes based on state
        // Use standard tailwind colors to ensure visibility
        const itemClasses = `
      group relative flex items-center gap-2.5 rounded-lg px-4 py-3 font-medium duration-300 ease-in-out
      ${isActive || isChildActive
                ? "bg-gray-900 text-white dark:bg-gray-800 dark:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"}
    `;

        return (
            <li key={index}>
                {hasSubItems ? (
                    <React.Fragment>
                        <Link
                            href="#"
                            className={itemClasses}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmenuToggle(item.name);
                            }}
                        >
                            <span className="h-6 w-6">
                                {item.icon}
                            </span>
                            <span className={`${!isExpanded && !isHovered ? "hidden" : "block"}`}>
                                {item.name}
                            </span>
                            {(isExpanded || isHovered) && (
                                <ChevronDownIcon
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current duration-200 ${isSubmenuOpen ? "rotate-180" : ""
                                        }`}
                                />
                            )}
                        </Link>
                        {/* Submenu */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ${!isExpanded && !isHovered ? "hidden" : isSubmenuOpen ? "block" : "hidden"
                                }`}
                        >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                {item.subItems?.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link
                                            href={subItem.path || "#"}
                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out ${pathname === subItem.path ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                                }`}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </React.Fragment>
                ) : (
                    <Link
                        href={item.path || "#"}
                        className={itemClasses}
                    >
                        <span className="h-6 w-6">
                            {item.icon}
                        </span>
                        <span className={`${!isExpanded && !isHovered ? "hidden" : "block"}`}>
                            {item.name}
                        </span>
                    </Link>
                )}
            </li>
        );
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 ${isExpanded || isHovered ? "w-72.5" : "w-20"
                } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* SIDEBAR HEADER */}
            <div className={`flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 ${!isExpanded && !isHovered ? "lg:justify-center lg:px-2" : ""}`}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                            src={COW_DAIRY_LOGO}
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {(isExpanded || isHovered) && (
                        <span className="text-xl font-bold text-black dark:text-white whitespace-nowrap">UTL Helpdesk</span>
                    )}
                </Link>
            </div>
            {/* SIDEBAR HEADER */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    <div>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            {navItems.map((item, index) => renderNavItem(item, index))}
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
