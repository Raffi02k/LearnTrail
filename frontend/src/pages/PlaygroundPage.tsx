import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { endpoints } from '../lib/api';
import { Topbar } from '../components/UI';
import {
    Play, Loader2, Plus, MessageSquare, Trash2,
    Pencil, Check, X, Search, ChevronLeft, ChevronRight
} from 'lucide-react';

interface PlaygroundSession {
    id: number;
    title: string;
    code: string;
    updated_at: string;
}

export const PlaygroundPage: React.FC = () => {
    // Session State
    const [sessions, setSessions] = useState<PlaygroundSession[]>([]);
    const [currentSession, setCurrentSession] = useState<PlaygroundSession | null>(null);
    const [code, setCode] = useState("");

    // UI State
    const [output, setOutput] = useState<{ text: string, error: string } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState("");

    // Load Sessions on Mount
    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async (selectId?: number) => {
        setIsLoading(true);
        try {
            const res = await endpoints.playgrounds.list();
            const data = res.data;
            setSessions(data);

            if (data.length > 0) {
                const toSelect = selectId ? data.find((s: any) => s.id === selectId) : data[0];
                selectSession(toSelect || data[0]);
            } else {
                handleCreateNew();
            }
        } catch (e) {
            console.error("Failed to load sessions", e);
        }
        setIsLoading(false);
    };

    const selectSession = (session: PlaygroundSession) => {
        setCurrentSession(session);
        setCode(session.code);
        setOutput(null);
    };

    // Auto-save logic
    useEffect(() => {
        if (!currentSession || code === currentSession.code) return;

        const timer = setTimeout(async () => {
            try {
                await endpoints.playgrounds.update(currentSession.id, { code });
                // Update local sessions list to reflect updated_at or code if needed (for title sync)
                setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, code } : s));
            } catch (e) {
                console.error("Auto-save failed", e);
            }
        }, 1000); // Save after 1s of inactivity

        return () => clearTimeout(timer);
    }, [code, currentSession]);

    const handleCreateNew = async () => {
        try {
            const res = await endpoints.playgrounds.create({
                title: "New Playground",
                code: "# Write your code here!\nprint('Hello!')"
            });
            const newSess = res.data;
            setSessions(prev => [newSess, ...prev]);
            selectSession(newSess);
        } catch (e) {
            console.error("Failed to create playground", e);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this environment?")) return;

        try {
            await endpoints.playgrounds.delete(id);
            setSessions(prev => prev.filter(s => s.id !== id));
            if (currentSession?.id === id) {
                const remaining = sessions.filter(s => s.id !== id);
                if (remaining.length > 0) selectSession(remaining[0]);
                else handleCreateNew();
            }
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    const startRename = (id: number, currentTitle: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTitleId(id);
        setNewTitle(currentTitle);
    };

    const handleRename = async (id: number) => {
        if (!newTitle.trim()) return setEditingTitleId(null);
        try {
            await endpoints.playgrounds.update(id, { title: newTitle });
            setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
            setEditingTitleId(null);
        } catch (e) {
            console.error("Rename failed", e);
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        try {
            const res = await endpoints.learn.run(code);
            const { output, error } = res.data;
            setOutput({ text: output, error });
        } catch (e) {
            setOutput({ text: "", error: "Failed to reach server" });
        }
        setIsRunning(false);
    };

    const filteredSessions = sessions.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading && sessions.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background text-primary">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="animate-pulse">Loading your environments...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden text-foreground">
            <Topbar title="Python Playground" />

            <div className="flex-1 flex overflow-hidden">
                {/* SIDEBAR (ChatGPT Style) */}
                <aside
                    className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-card border-r border-border flex flex-col transition-all duration-300 overflow-hidden relative group`}
                >
                    <div className="p-4 space-y-4 min-w-[288px]">
                        <button
                            onClick={handleCreateNew}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold transition-all active:scale-[0.98] shadow-lg shadow-green-500/10"
                        >
                            <Plus size={18} />
                            New Environment
                        </button>

                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search environments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto min-w-[288px] px-2 space-y-1 pb-4">
                        {filteredSessions.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => selectSession(s)}
                                className={`group/item relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${currentSession?.id === s.id
                                    ? 'bg-secondary text-foreground'
                                    : 'hover:bg-secondary/30 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <MessageSquare size={16} className={currentSession?.id === s.id ? "text-primary" : "opacity-50"} />

                                {editingTitleId === s.id ? (
                                    <div className="flex-1 flex items-center gap-1">
                                        <input
                                            autoFocus
                                            className="bg-background border border-primary rounded px-1 flex-1 text-xs outline-none"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleRename(s.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Check size={14} className="text-green-500 cursor-pointer" onClick={() => handleRename(s.id)} />
                                    </div>
                                ) : (
                                    <div className="flex-1 truncate text-sm font-medium pr-10">
                                        {s.title}
                                    </div>
                                )}

                                {!editingTitleId && (
                                    <div className="absolute right-2 opacity-0 group-hover/item:opacity-100 flex items-center gap-1 transition-opacity">
                                        <button
                                            onClick={(e) => startRename(s.id, s.title, e)}
                                            className="p-1 hover:bg-background rounded"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(s.id, e)}
                                            className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-border text-[10px] text-muted-foreground text-center min-w-[288px]">
                        Automatically saved in the cloud
                    </div>

                    {/* Collapse Toggle Label/Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-border flex items-center justify-center rounded-full border border-border shadow-md z-10 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 flex flex-col md:flex-row min-w-0">

                    {/* EDITOR SECTION */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                        <div className="flex items-center justify-between bg-[#1e1e1e] border-b border-[#2b2b2b] px-6 py-2">
                            <div className="flex items-center gap-4">
                                {!isSidebarOpen && (
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="p-1 hover:bg-secondary rounded text-muted-foreground"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                )}
                                <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                                    <span className="bg-blue-500/20 text-blue-400 px-1.5 rounded font-bold">PY</span>
                                    {currentSession?.title}.py
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground italic">
                                Last modified: {currentSession && new Date(currentSession.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <Editor
                                height="100%"
                                defaultLanguage="python"
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 16,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 20 },
                                    fontFamily: "'Fira Code', monospace",
                                    cursorBlinking: "smooth",
                                    cursorSmoothCaretAnimation: "on",
                                    smoothScrolling: true,
                                }}
                            />
                        </div>

                        <div className="h-16 bg-card border-t border-border flex items-center justify-between px-6">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-8 rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-green-500/20"
                            >
                                {isRunning ? <Loader2 className="animate-spin" size={18} /> : <Play fill="currentColor" size={18} />}
                                Run
                            </button>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Ready to execute
                            </div>
                        </div>
                    </div>

                    {/* OUTPUT SECTION */}
                    <div className="w-full md:w-[35%] bg-[#0d0d0d] flex flex-col border-l border-border shadow-2xl overflow-hidden">
                        <div className="px-6 py-3 border-b border-border bg-card/40 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Console Output</span>
                            <button
                                onClick={() => setOutput(null)}
                                className="text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground hover:underline transition-all"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
                            {!output && !isRunning && (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/20 text-center opacity-50">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-4">
                                        <Play size={24} className="ml-1" />
                                    </div>
                                    <p className="max-w-[150px] text-xs">Write Python code and click Run to see the results here.</p>
                                </div>
                            )}

                            {isRunning && (
                                <div className="flex items-center gap-3 text-muted-foreground italic animate-pulse">
                                    <Loader2 className="animate-spin" size={14} />
                                    Executing code...
                                </div>
                            )}

                            {output && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                    {output.text && (
                                        <div className="text-foreground whitespace-pre-wrap leading-relaxed break-words">
                                            {output.text}
                                        </div>
                                    )}
                                    {output.error && (
                                        <div className="relative group">
                                            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-red-500 rounded-full" />
                                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase mb-2">
                                                    <X size={14} /> Error Message
                                                </div>
                                                <div className="text-red-300 text-xs leading-5 whitespace-pre-wrap font-mono">
                                                    {output.error}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {output.text === "" && !output.error && (
                                        <div className="text-muted-foreground/40 italic text-xs">
                                            (Process finished without output)
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}} />
        </div>
    );
};
