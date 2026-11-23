import React, { useEffect, useState } from 'react';
import { Topbar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../lib/api';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Award } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [, setProgress] = useState<any[]>([]);

    useEffect(() => {
        endpoints.courses.list().then((res: any) => setCourses(res.data));
        endpoints.progress.me().then((res: any) => setProgress(res.data));
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Topbar title="Dashboard" />
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">

                {/* Hero / Resume */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-secondary to-card border border-border rounded-2xl p-8 flex flex-col justify-between shadow-lg">
                        <div className="space-y-4">
                            <div className="bg-primary/20 text-primary w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Resume Learning
                            </div>
                            <h2 className="text-3xl font-bold">Welcome back to the trail</h2>
                            <p className="text-muted-foreground max-w-md">
                                You made great progress on "Learn Python 3". Continue where you left off to keep your streak alive!
                            </p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/devops-study" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold md:text-lg hover:shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-95">
                                <BookIcon />
                                Läs Studieguide & Träna
                            </Link>

                            <Link to="/devops-quiz" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold md:text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 animate-pulse">
                                <Award size={20} />
                                Starta DevOps Quiz (20 Frågor)
                            </Link>

                            <Link to="/learn/learn-python-3/1/1" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-xl font-bold border border-border hover:bg-secondary/80 transition-all active:scale-95">
                                <Play fill="currentColor" size={18} />
                                Resume Python 3
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                <Award size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{user?.xp_total ?? 0}</div>
                                <div className="text-sm text-muted-foreground">Total XP</div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">3 Day</div>
                                <div className="text-sm text-muted-foreground">Streak</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BookIcon /> My Courses
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <Link to={`/learn/${course.slug}/1/1`} key={course.id} className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                                        <CodeIcon />
                                    </div>
                                    <div className="text-xs font-mono bg-secondary px-2 py-1 rounded text-muted-foreground">
                                        {course.level}
                                    </div>
                                </div>
                                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{course.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>{course.percent}% Complete</span>
                                        <span>{course.completed_lessons} / {course.total_lessons} Lessons</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${course.percent}%` }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

const BookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const CodeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
