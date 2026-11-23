import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Lock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Topbar: React.FC<{ title?: string }> = ({ title }) => {
    const { user, logout } = useAuth();

    return (
        <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
                <Link to="/dashboard" className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-black">LT</div>
                    LearnTrail
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/devops-study" className="px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                        <span className="text-emerald-400">📖</span>
                        Studieguide
                    </Link>
                    <Link to="/devops-quiz" className="px-3 py-1.5 rounded-lg text-sm font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        DevOps Quiz
                    </Link>
                    <Link to="/playground" className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        Playground
                    </Link>
                </nav>

                {title && (
                    <div className="hidden lg:flex items-center gap-2">
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium text-sm">{title}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.xp_total || 0} XP</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                            <UserIcon size={18} />
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-secondary rounded-full transition-colors" title="Sign out">
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SidebarItem: React.FC<{
    active?: boolean;
    completed?: boolean;
    locked?: boolean;
    title: string;
    onClick?: () => void;
    icon?: React.ReactNode
}> = ({ active, completed, locked, title, onClick, icon }) => {
    const isDisabled = !!locked && !active;
    return (
        <button
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
            className={cn(
                "w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors border-l-2",
                active
                    ? "bg-secondary border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                completed && !active && "text-muted-foreground/70",
                isDisabled && "opacity-60 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
            )}
        >
            {icon ? icon : (
                <div className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    completed ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground",
                    active && !completed && "border-primary",
                    locked && !completed && "border-muted-foreground/60"
                )}>
                    {completed && <Check size={12} className="text-white" />}
                    {!completed && locked && <Lock size={12} className="text-muted-foreground" />}
                </div>
            )}
            <span className="truncate">{title}</span>
        </button>
    )
}
