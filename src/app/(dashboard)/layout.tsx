"use client";
import React from "react";
import AppSidebar from "@/components/layout/app-sidebar"; // Note: Changed from named import to default import based on new file content
import AppHeader from "@/components/layout/app-header";
// import { Header } from "@/components/layout/header"; // Header might need adjustment or removal if new sidebar covers it
import { useSidebar } from "@/context/SidebarContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isExpanded, isHovered, isMobileOpen, toggleMobileSidebar } = useSidebar();

    // Calculate margin based on sidebar state used in the new AppSidebar
    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]";

    return (
        <div className="min-h-screen xl:flex bg-gray-100 dark:bg-[#1a222c]">
            <AppSidebar />

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => toggleMobileSidebar()}
                />
            )}

            <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin} overflow-x-hidden`}>
                <AppHeader />
                <main className="p-4 mx-auto max-w-screen-2xl md:p-6 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    )
}
