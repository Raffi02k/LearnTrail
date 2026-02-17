import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { endpoints } from '../lib/api';
import { Topbar, SidebarItem } from '../components/UI';
import { Play, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';


export const LearningPage: React.FC = () => {
    const { courseSlug, exerciseId } = useParams();
    const navigate = useNavigate();

    // State
    const [course, setCourse] = useState<any>(null);
    const [currentExercise, setCurrentExercise] = useState<any>(null);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState<{ text: string, error: string, passed: boolean } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Course Structure
    useEffect(() => {
        if (!courseSlug) return;
        endpoints.courses.get(courseSlug).then((res: any) => {
            setCourse(res.data);
            setIsLoading(false);
        });
    }, [courseSlug]);

    // Setup Current Exercise
    useEffect(() => {
        if (!course || !exerciseId) return;

        // Find exercise in course structure for details (prompt etc)
        let found = null;
        for (const mod of course.modules) {
            for (const les of mod.lessons) {
                const ex = les.exercises.find((e: any) => e.id === Number(exerciseId));
                if (ex) {
                    found = ex;
                    break;
                }
            }
        }

        if (found) {
            setCurrentExercise(found);
            // Fetch progress (last code)
            endpoints.progress.getExercise(found.id).then((res: any) => {
                setCode(res.data.code || found.starter_code);
            });
            setOutput(null);
        }
    }, [course, exerciseId]);

    const handleRun = async () => {
        if (!currentExercise) return;
        setIsRunning(true);
        try {
            const res = await endpoints.learn.run(code, currentExercise.id);
            const { output, error, passed } = res.data;
            setOutput({ text: output, error, passed });

            // If passed, update progress
            if (passed) {
                await endpoints.progress.update(currentExercise.id, {
                    status: "completed",
                    code: code,
                    completed: true
                });
                // Update local state if needed
            } else {
                await endpoints.progress.update(currentExercise.id, {
                    status: "in_progress",
                    code: code
                });
            }
        } catch (e) {
            setOutput({ text: "", error: "Failed to reach server", passed: false });
        }
        setIsRunning(false);
    };

    const handleNext = () => {
        // Find next exercise ID
        // Simplified Logic: Just go to next in list
        if (!course) return;

        let allExercises: any[] = [];
        course.modules.forEach((m: any) => m.lessons.forEach((l: any) => allExercises.push(...l.exercises)));

        const idx = allExercises.findIndex(e => e.id === Number(exerciseId));
        if (idx >= 0 && idx < allExercises.length - 1) {
            const next = allExercises[idx + 1];
            // Need to find lesson ID for URL ... actually URL is /learn/:slug/:lessonId/:exId
            // My default route param setup might be redundant if exercise IDs are unique globally or I can lookup
            // Let's brute force find the lesson ID for the next exercise
            let nextLessonId = 0;
            for (const mod of course.modules) {
                for (const les of mod.lessons) {
                    if (les.exercises.find((e: any) => e.id === next.id)) {
                        nextLessonId = les.id;
                    }
                }
            }
            navigate(`/learn/${courseSlug}/${nextLessonId}/${next.id}`);
        } else {
            // Course Complete!
            navigate("/dashboard");
        }
    };

    if (isLoading || !course) return <div className="h-screen flex items-center justify-center bg-background text-primary"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            <Topbar title={course.title} />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-card border-r border-border overflow-y-auto hidden md:block">
                    <div className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Course Content</div>
                    {course.modules.map((mod: any) => (
                        <div key={mod.id} className="mb-4">
                            <div className="px-4 py-2 font-bold text-foreground">{mod.title}</div>
                            {mod.lessons.map((les: any) => (
                                <div key={les.id}>
                                    <div className="px-4 py-1 text-xs text-muted-foreground font-semibold mt-2 mb-1">{les.title}</div>
                                    {les.exercises.map((ex: any) => (
                                        <SidebarItem
                                            key={ex.id}
                                            title={ex.title}
                                            active={Number(exerciseId) === ex.id}
                                            completed={false /* TODO: inject completed map */}
                                            onClick={() => navigate(`/learn/${courseSlug}/${les.id}/${ex.id}`)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Center & Right Pane (Split Layout) */}
                <div className="flex-1 flex flex-col md:flex-row min-w-0">

                    {/* Editor Area (Center - 50%) */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                        {/* Prompt/Tabs */}
                        <div className="h-full flex flex-col">
                            {/* Exercise Description Panel (Top) - Optional, maybe put in left? 
                                Codecademy puts instructions on LEFT usually. 
                                User asked for Left Sidebar=Lessons. 
                                Where do instructions go? 
                                "Exercise: prompt/instruktioner"
                                Let's put instructions in a resizable pane or Tab 0? 
                                Let's put Instructions in a Left-Side Panel that replaces Sidebar? 
                                Or Split Center into Instructions | Editor
                            */}

                            {/* Let's follow Codecademy:
                                Left: Instructions (text)
                                Center: Editor
                                Right: Output
                                
                                User Request:
                                "Left sidebar: kursinnehåll (lektioner)..."
                                "Center: kod-editor..."
                                "Right: output..."
                                
                                Wait, where is the prompt? 
                                "Left sidebar: kursinnehåll..." 
                                Maybe prompt is above editor or overlaid? 
                                I'll put prompt in a "Instructions" tab in the Center, OR split the Center.
                                Let's split the Center area into: Instructions (30%) + Editor (70%)? 
                                Or just put Instructions above Editor.
                                I'll put Instructions in a scrollable area to the left of the Editor, effectively making 4 columns?
                                Sidebar | Instructions | Editor | Output
                                That's crowded. 
                                
                                I will add a "Instructions" toggle or split the "Center" into "Instructions" and "Editor".
                            */}

                            <div className="flex-1 flex overflow-hidden">
                                {/* Instructions Column */}
                                <div className="w-1/3 min-w-[300px] bg-background border-r border-border flex flex-col overflow-y-auto p-6 prose prose-invert prose-sm">
                                    <h2 className="text-xl font-bold mb-4">{currentExercise?.title}</h2>
                                    <div className="whitespace-pre-wrap text-muted-foreground">
                                        {currentExercise?.prompt}
                                    </div>
                                    <div className="mt-8 p-4 bg-secondary/30 rounded-lg border border-border">
                                        <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Instructions</div>
                                        <p className="text-sm">Follow the instructions above and click "Run" to verify your code.</p>
                                    </div>
                                </div>

                                {/* Editor Column */}
                                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                                    <div className="flex items-center justify-between bg-[#1e1e1e] border-b border-[#2b2b2b] px-4 py-2">
                                        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                                            <span className="bg-blue-500/20 text-blue-400 px-1.5 rounded">PY</span>
                                            script.py
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
                                                fontSize: 14,
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                                padding: { top: 16 }
                                            }}
                                        />
                                    </div>
                                    {/* Action Bar (Bottom of Editor) */}
                                    <div className="h-16 bg-card border-t border-border flex items-center justify-between px-6">
                                        <button
                                            onClick={handleRun}
                                            disabled={isRunning}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all"
                                        >
                                            {isRunning ? <Loader2 className="animate-spin" size={18} /> : <Play fill="currentColor" size={18} />}
                                            Run
                                        </button>

                                        {output?.passed && (
                                            <button
                                                onClick={handleNext}
                                                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
                                            >
                                                Next <ChevronRight size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel (Output) */}
                    <div className="w-80 bg-[#151515] border-l border-border flex flex-col font-mono text-sm">
                        <div className="px-4 py-2 border-b border-border bg-card/50 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                            Output / Console
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {!output && <div className="text-muted-foreground/50 italic">Run your code to see output...</div>}

                            {output && (
                                <div className="space-y-4">
                                    {output.text && (
                                        <div className="whitespace-pre-wrap text-foreground">{output.text}</div>
                                    )}
                                    {output.error && (
                                        <div className="text-red-400 whitespace-pre-wrap bg-red-900/10 p-2 rounded border border-red-900/50">
                                            {output.error}
                                        </div>
                                    )}
                                    {output.passed && (
                                        <div className="flex items-center gap-2 text-green-400 font-bold mt-4 pt-4 border-t border-border">
                                            <CheckCircle size={16} />
                                            <span>Tests Passed!</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
