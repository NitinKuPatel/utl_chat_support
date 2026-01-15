"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
    isExpanded: boolean;
    isMobileOpen: boolean;
    isHovered: boolean;
    activeItem: string | null;
    openSubmenu: string | null;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    setIsHovered: (isHovered: boolean) => void;
    setActiveItem: (item: string | null) => void;
    toggleSubmenu: (item: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // Load sidebar state from localStorage on mount
    const [isExpanded, setIsExpanded] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebar-expanded');
            return saved !== null ? saved === 'true' : true;
        }
        return true;
    });

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Persist sidebar expanded state to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-expanded', String(isExpanded));
        }
    }, [isExpanded]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileOpen(false);
            } else {
                // On mobile, ensure sidebar is closed by default
                setIsMobileOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsExpanded((prev) => {
            const newValue = !prev;
            // Save to localStorage immediately
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebar-expanded', String(newValue));
            }
            return newValue;
        });
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen((prev) => !prev);
    };

    const toggleSubmenu = (item: string) => {
        setOpenSubmenu((prev) => (prev === item ? null : item));
    };

    return (
        <SidebarContext.Provider
            value={{
                // On desktop, always respect isExpanded state. On mobile, sidebar is collapsed by default
                isExpanded: isMobile ? false : isExpanded,
                isMobileOpen,
                isHovered,
                activeItem,
                openSubmenu,
                toggleSidebar,
                toggleMobileSidebar,
                setIsHovered,
                setActiveItem,
                toggleSubmenu,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
