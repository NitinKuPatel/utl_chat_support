"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, Plus, FileText, Download, Trash2, Eye, RefreshCw, BookOpen, Database, FolderOpen, Upload, Calendar, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data removed in favor of API
// Interface matches backend response
interface KnowledgeFile {
    id: number; // Using number for UI compat, but backend sends string file_id
    file_id: string;
    name: string;
    type: string;
    size: string;
    uploaded: string;
    domain: string;
    status: string;
    model_number?: string;
}

export default function KnowledgeBasePage() {
    // State
    const [files, setFiles] = useState<KnowledgeFile[]>([])
    const [activeTab, setActiveTab] = useState("organisation") // Default tab, though strictly API works for 'customer'/'employee'
    const [selected, setSelected] = useState<string[]>([]) // Array of selected file_ids
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [modelNumber, setModelNumber] = useState("")
    const [docType, setDocType] = useState("")
    const [productCategory, setProductCategory] = useState("")

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

    // Fetch Files
    const fetchFiles = async () => {
        if (activeTab === "organisation") return; // Skip organisation tab

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/knowledge/?domain=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                // Map backend data to UI format
                const mappedFiles = data.map((f: any, index: number) => ({
                    id: index, // UI needs unique number key for some lists? using file_id ideally.
                    file_id: f.file_id,
                    name: f.file_name,
                    type: f.file_name.split('.').pop()?.toUpperCase() || "FILE",
                    size: "Unknown", // Backend metadata might need to return size
                    uploaded: f.upload_timestamp ? new Date(f.upload_timestamp).toISOString().split('T')[0] : "N/A",
                    domain: f.domain,
                    status: "processed", // Defaulting as backend currently returns processed files
                    model_number: f.model_number
                }));
                setFiles(mappedFiles);
            } else {
                console.error("Failed to fetch files");
            }
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when tab changes
    useEffect(() => {
        if (activeTab !== "organisation") {
            fetchFiles();
        } else {
            setFiles([]); // Clear files for organisation tab
        }
    }, [activeTab]);


    // File Upload Ref
    // Open Modal
    const openUploadModal = () => {
        setIsUploadModalOpen(true)
        // Reset form
        setSelectedFile(null)
        setModelNumber("")
        setDocType("")
        setProductCategory("")
    }

    // Handle File Selection inside modal
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0])
        }
    }

    // Submit Upload
    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) {
            alert("Please select a file first.")
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("domain", activeTab)
        if (modelNumber) formData.append("model_number", modelNumber)
        if (docType) formData.append("doc_type", docType)
        if (productCategory) formData.append("product_category", productCategory)

        try {
            const res = await fetch(`${API_BASE_URL}/knowledge/upload`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("File uploaded successfully!");
                setIsUploadModalOpen(false) // Close modal
                fetchFiles(); // Refresh list
            } else {
                const err = await res.json();
                alert(`Upload failed: ${err.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Check console.");
        } finally {
            setUploading(false);
        }
    }

    /* const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (activeTab === "organisation") {
            alert("Uploads not supported for Organisation tab yet.");
            return;
        }

        const selectedFiles = event.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        const file = selectedFiles[0]; // Process single file for now
        const formData = new FormData();
        formData.append("file", file);
        formData.append("domain", activeTab);

        try {
            const res = await fetch(`${API_BASE_URL}/knowledge/upload`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("File uploaded successfully!");
                fetchFiles(); // Refresh list
            } else {
                const err = await res.json();
                alert(`Upload failed: ${err.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Check console.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        }
    } */

    // Selection Handlers
    const handleSelectAll = (checked: boolean, currentTabFiles: KnowledgeFile[]) => {
        if (checked) {
            setSelected(currentTabFiles.map(f => f.file_id))
        } else {
            setSelected([])
        }
    }

    const handleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const handleDeleteSelected = async () => {
        if (!confirm(`Are you sure you want to delete ${selected.length} files?`)) return;

        for (const fileId of selected) {
            try {
                await fetch(`${API_BASE_URL}/knowledge/${fileId}`, {
                    method: "DELETE"
                });
            } catch (error) {
                console.error(`Failed to delete ${fileId}`, error);
            }
        }

        setSelected([]);
        fetchFiles(); // Refresh
    }

    // Advanced Filter States
    const [filterQuery, setFilterQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [filterField, setFilterField] = useState("name") // name, type, status
    const [timelineFilter, setTimelineFilter] = useState("all") // all, today, yesterday, thisweek, lastmonth

    // Filter Logic
    const getFilteredFiles = () => {
        let filtered = files.filter(file => file.domain === activeTab)

        // 1. Text Search (Field based)
        if (filterQuery) {
            const query = filterQuery.toLowerCase()
            filtered = filtered.filter(file => {
                if (filterField === "name") return file.name.toLowerCase().includes(query)
                if (filterField === "type") return file.type.toLowerCase().includes(query)
                if (filterField === "status") return file.status.toLowerCase().includes(query)
                return false
            })
        }

        // 2. Timeline Filter
        if (timelineFilter !== "all") {
            const now = new Date() // Assuming "today" is fixed relative to mock data or real time. 
            // For mock data consistency, let's assume "2024-01-14" is today for testing if needed, but standard logic uses actual today.
            // Using actual today:
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            filtered = filtered.filter(file => {
                const fileDate = new Date(file.uploaded)
                fileDate.setHours(0, 0, 0, 0)

                if (timelineFilter === "today") {
                    return fileDate.getTime() === today.getTime()
                }
                if (timelineFilter === "yesterday") {
                    const yest = new Date(today)
                    yest.setDate(yest.getDate() - 1)
                    return fileDate.getTime() === yest.getTime()
                }
                if (timelineFilter === "lastweek") {
                    const lastWeek = new Date(today)
                    lastWeek.setDate(lastWeek.getDate() - 7)
                    return fileDate >= lastWeek
                }
                if (timelineFilter === "lastmonth") {
                    const lastMonth = new Date(today)
                    lastMonth.setMonth(lastMonth.getMonth() - 1)
                    return fileDate >= lastMonth
                }
                return true
            })
        }

        return filtered
    }

    const filteredFiles = getFilteredFiles()

    const handleRefresh = () => {
        fetchFiles();
    }

    const handleDownload = () => {
        if (filteredFiles.length === 0) {
            alert("No files to download")
            return
        }

        const headers = ["ID", "File Name", "Type", "Size", "Domain", "Status", "Uploaded"]
        const csvRows = [
            headers.join(','),
            ...filteredFiles.map(file => [
                file.id,
                `"${file.name}"`,
                file.type,
                file.size,
                file.domain,
                file.status,
                file.uploaded
            ].join(','))
        ]

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `knowledge_base_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getFileIcon = (type: string) => {
        switch (type) {
            case "PDF": return <FileText className="h-5 w-5 text-red-500" />;
            case "DOCX": return <FileText className="h-5 w-5 text-blue-500" />;
            case "XLSX": return <FileText className="h-5 w-5 text-emerald-500" />;
            case "PPTX": return <FileText className="h-5 w-5 text-orange-500" />;
            default: return <FileText className="h-5 w-5 text-gray-500" />;
        }
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-8 space-y-8">
            {/* Header Section (Premium Banner) */}
            <div className="flex flex-col gap-8">
                <div className="relative overflow-hidden rounded-[32px] border border-gray-200 dark:border-gray-800 bg-gray-900 shadow-2xl h-auto md:h-[280px]">
                    <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/himage/ticketimg.png')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col md:flex-row h-full justify-between items-start md:items-end gap-6">
                        <div className="space-y-4 max-w-xl">
                            <div>
                                <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Central Repository</p>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                                    Fujiyama <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Knowledge</span>
                                </h1>
                                <p className="text-gray-300 mt-2 text-sm md:text-base font-medium max-w-lg">
                                    Manage documents, guides, and policies for your organization.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <BookOpen className="w-4 h-4 text-cyan-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Articles</p>
                                        <p className="text-white text-xs font-bold">{files.length} Files</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                                    <Database className="w-4 h-4 text-orange-400" />
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Storage</p>
                                        <p className="text-white text-xs font-bold">45% Used</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="organisation" className="space-y-6" onValueChange={setActiveTab}>

                {/* Advanced Filter Bar (Replaces simple search) */}
                <Card className="border-none shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-visible z-10">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <TabsList className="grid grid-cols-3 h-12 bg-gray-100/50 dark:bg-gray-900/50 rounded-xl p-1 w-full md:w-auto">
                                <TabsTrigger value="organisation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 font-medium">Organisation</TabsTrigger>
                                <TabsTrigger value="customer" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 font-medium">Customer</TabsTrigger>
                                <TabsTrigger value="employee" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 font-medium">Employee</TabsTrigger>
                            </TabsList>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                {selected.length > 0 && (
                                    <Button
                                        onClick={handleDeleteSelected}
                                        className="bg-red-600 hover:bg-red-700 text-white animate-in fade-in zoom-in duration-200 flex-1 md:flex-none shadow-md flex items-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete ({selected.length})
                                    </Button>
                                )}
                                {activeTab !== "organisation" && (
                                    <Button
                                        onClick={openUploadModal}
                                        className="bg-[#0FA968] hover:bg-emerald-600 text-white border border-emerald-500/50 shadow-md rounded-xl px-4 transition-all hover:scale-105 flex-1 md:flex-none"
                                    >
                                        <Upload className="mr-2 h-4 w-4" /> Upload
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex-1 md:flex-none border-gray-200 dark:border-gray-700 ${showFilters ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" /> Filters
                                </Button>
                                <Button variant="outline" onClick={handleDownload} className="flex-1 md:flex-none border-gray-200 dark:border-gray-700">
                                    <Download className="w-4 h-4 mr-2" /> Export
                                </Button>
                                <Button variant="outline" onClick={handleRefresh} className="border-gray-200 dark:border-gray-700">
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Search & Filter Inputs */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder={`Search by ${filterField}...`}
                                    value={filterQuery}
                                    onChange={(e) => setFilterQuery(e.target.value)}
                                    className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-base"
                                />
                            </div>

                            {showFilters && (
                                <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-2 duration-200">
                                    <div className="min-w-[180px]">
                                        <select
                                            className="w-full h-11 px-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                            value={filterField}
                                            onChange={(e) => setFilterField(e.target.value)}
                                        >
                                            <option value="name">Filter by Name</option>
                                            <option value="type">Filter by Type</option>
                                            <option value="status">Filter by Status</option>
                                        </select>
                                    </div>
                                    <div className="min-w-[180px]">
                                        <select
                                            className="w-full h-11 px-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                                            value={timelineFilter}
                                            onChange={(e) => setTimelineFilter(e.target.value)}
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="yesterday">Yesterday</option>
                                            <option value="lastweek">Last 7 Days</option>
                                            <option value="lastmonth">Last 30 Days</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Content Tables */}
                {["organisation", "customer", "employee"].map((domain) => (
                    <TabsContent key={domain} value={domain}>
                        <Card className="border-none shadow-xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="capitalize flex items-center gap-2">
                                        <FolderOpen className="w-5 h-5 text-cyan-500" /> {domain} Documents
                                    </CardTitle>
                                    <Badge variant="outline" className="font-mono">{filteredFiles.length} found</Badge>
                                </div>
                                <CardDescription>
                                    Access and manage official documentation for {domain} context.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                                            <TableRow>
                                                <TableHead className="w-[50px] pl-6 h-12">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 transition-all cursor-pointer accent-cyan-600"
                                                        checked={filteredFiles.length > 0 && filteredFiles.every(f => selected.includes(f.file_id))}
                                                        onChange={(e) => handleSelectAll(e.target.checked, filteredFiles)}
                                                    />
                                                </TableHead>
                                                <TableHead className="font-semibold text-gray-500 h-12">File Name</TableHead>
                                                <TableHead className="font-semibold text-gray-500 h-12">Type</TableHead>
                                                <TableHead className="font-semibold text-gray-500 h-12">Size</TableHead>
                                                <TableHead className="font-semibold text-gray-500 h-12">Status</TableHead>
                                                <TableHead className="font-semibold text-gray-500 h-12">Uploaded</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-500 pr-6 h-12">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-32 text-center">
                                                        <div className="flex items-center justify-center gap-2 text-cyan-600">
                                                            <RefreshCw className="w-6 h-6 animate-spin" />
                                                            <span>Refreshing...</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredFiles.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-32 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                                            <FolderOpen className="w-8 h-8 opacity-20" />
                                                            <p>No documents found based on current filters.</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredFiles.map((file) => (
                                                    <TableRow
                                                        key={file.id}
                                                        className={`hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 cursor-pointer transition-colors group ${selected.includes(file.file_id) ? 'bg-cyan-50/50 dark:bg-cyan-900/20' : ''}`}
                                                        onClick={() => handleSelect(file.file_id)}
                                                    >
                                                        <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 transition-all cursor-pointer accent-cyan-600"
                                                                checked={selected.includes(file.file_id)}
                                                                onChange={() => handleSelect(file.file_id)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-white transition-colors">
                                                                    {getFileIcon(file.type)}
                                                                </div>
                                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-cyan-700 transition-colors">{file.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell><Badge variant="outline" className="font-mono text-xs">{file.type}</Badge></TableCell>
                                                        <TableCell className="text-gray-500 text-sm">{file.size}</TableCell>
                                                        <TableCell>
                                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                                ${file.status === "processed"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                                                                }`}>
                                                                {file.status === "processed" ? "Synced" : "Processing..."}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-500 text-sm">{file.uploaded}</TableCell>
                                                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" title="Preview" className="hover:text-cyan-600 hover:bg-cyan-50">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" title="Download" className="hover:text-blue-600 hover:bg-blue-50">
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        if (confirm('Delete this file?')) {
                                                                            // Calling handleDeleteSelected with just this ID would be cleaner, but existing method is bulk.
                                                                            // Let's reuse bulk logic by setting selection temporarily or just direct call.
                                                                            // For now, simpler to select and delete or add single delete handler.
                                                                            // Using direct fetch for single item:
                                                                            fetch(`${API_BASE_URL}/knowledge/${file.file_id}`, { method: 'DELETE' }).then(() => fetchFiles());
                                                                        }
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Upload className="w-5 h-5 text-cyan-500" /> Upload Document
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsUploadModalOpen(false)} className="rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                                <X className="w-5 h-5 text-gray-500" />
                            </Button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                            {/* File Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select File <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-cyan-400 hover:bg-cyan-50/10 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileSelect}
                                    />
                                    {selectedFile ? (
                                        <>
                                            <FileText className="w-8 h-8 text-emerald-500" />
                                            <p className="text-sm font-medium text-gray-900 dark:text-white text-center break-all">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm text-gray-500">Click or drag file to upload</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Metadata Fields */}
                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Number</label>
                                    <Input
                                        placeholder="e.g. UT-2024-X"
                                        value={modelNumber}
                                        onChange={(e) => setModelNumber(e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Doc Type</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-xl bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            value={docType}
                                            onChange={(e) => setDocType(e.target.value)}
                                        >
                                            <option value="">Select Type...</option>
                                            <option value="Manual">Manual</option>
                                            <option value="Datasheet">Datasheet</option>
                                            <option value="Warranty">Warranty</option>
                                            <option value="Guide">Guide</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Category</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-xl bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            value={productCategory}
                                            onChange={(e) => setProductCategory(e.target.value)}
                                        >
                                            <option value="">Select Category...</option>
                                            <option value="Solar Panels">Solar Panels</option>
                                            <option value="Inverters">Inverters</option>
                                            <option value="Batteries">Batteries</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" disabled={uploading || !selectedFile} className="bg-[#0FA968] hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                                    {uploading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" /> Upload File
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
