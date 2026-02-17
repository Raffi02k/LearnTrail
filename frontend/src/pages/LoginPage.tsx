import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, ChevronRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const { loginLocal, loginOidc, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");

    React.useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    const handleLocalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await loginLocal(email, password);
        } catch (err) {
            setError("Invalid credentials or server error");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] bg-[radial-gradient(circle_at_top_right,_#1a1f2e_0%,_transparent_40%)] flex items-center justify-center p-4 font-sans selection:bg-primary/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-xl relative">
                {/* Decorative Terminal-like header for the whole section */}
                <div className="mb-8 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        SYSTEM_READY: LEARN_TRAIL_V1.0
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white">
                        Learn<span className="text-primary italic">Trail</span>
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">
                        # master_the_code()
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Main Auth Card */}
                    <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
                        {/* Terminal Header Bar */}
                        <div className="bg-[#161b22] px-4 py-2 border-b border-white/5 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">auth_session.py</div>
                            <div className="w-8" /> {/* Spacer */}
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Microsoft SSO - Primary Action */}
                            <div className="space-y-4">
                                <button
                                    onClick={loginOidc}
                                    className="w-full group/btn relative flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 23 23">
                                        <path fill="#f35325" d="M1 1h10v10H1z" />
                                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                                    </svg>
                                    Sign in with Microsoft
                                    <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                </button>

                                <div className="flex items-center gap-4 py-2">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">or_use_local_credentials</span>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                                </div>
                            </div>

                            {/* Local Login Form */}
                            <form onSubmit={handleLocalLogin} className="space-y-5">
                                {error && (
                                    <div className="p-4 text-xs font-mono text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center gap-3 animate-shake">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                        {`Error: ${error.toUpperCase()}`}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="relative group/field">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/field:text-primary transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="developer@learntrail.sh"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-[#161b22]/50 border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-12 py-3.5 outline-none transition-all placeholder:text-muted-foreground/30 font-mono text-sm"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/0 group-focus-within/field:text-muted-foreground/50 transition-all">
                                            [EMAIL]
                                        </div>
                                    </div>

                                    <div className="relative group/field">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/field:text-primary transition-colors">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="************"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-[#161b22]/50 border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-12 py-3.5 outline-none transition-all placeholder:text-muted-foreground/30 font-mono text-sm"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/0 group-focus-within/field:text-muted-foreground/50 transition-all">
                                            [PWD]
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] flex items-center justify-center gap-2 group/login"
                                >
                                    AUTHENTICATE
                                    <Terminal className="w-4 h-4 group-hover/login:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* Interactive Footer */}
                        <div className="bg-[#161b22] px-8 py-4 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] font-mono text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    DB_CONNECTED
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    OIDC_ACTIVE
                                </span>
                            </div>
                            <div className="italic">v1.2.4-stable</div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                            <code className="bg-white/5 text-primary px-1.5 py-0.5 rounded border border-white/10 uppercase">DemoCredentials:</code>
                            <span>test@example.com / password123</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-[11px] font-mono text-white/40 hover:text-primary transition-colors underline decoration-white/10 underline-offset-4">API_DOCS</a>
                            <a href="#" className="text-[11px] font-mono text-white/40 hover:text-primary transition-colors underline decoration-white/10 underline-offset-4">STATUS</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
