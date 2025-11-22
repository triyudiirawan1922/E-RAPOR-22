import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { storageService } from './services/storageService';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import { 
    LayoutDashboard, Users, FileSpreadsheet, 
    Printer, Settings, LogOut, Menu, X,
    Cpu, Sparkles, ChevronLeft, PanelLeftOpen,
    Table, UserCog, Loader2
} from 'lucide-react';

// Lazy Imports
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Students = React.lazy(() => import('./pages/Students'));
const Grades = React.lazy(() => import('./pages/Grades'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Leger = React.lazy(() => import('./pages/Leger'));
const AppSettings = React.lazy(() => import('./pages/AppSettings'));
const TeacherProfile = React.lazy(() => import('./pages/TeacherProfile'));

// --- Private Route Component ---
const PrivateRoute = ({ children, user }: { children: React.ReactNode; user: User | null }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// --- Main App ---
function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('erapor_session');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('erapor_session');
            }
        }
        setLoading(false);
    }, []);

    if (loading) return <Loading />;

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <div className="min-h-screen font-sans text-slate-200 bg-slate-900 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
                    {/* Ultra Lightweight Background (CSS Only) */}
                    <div className="fixed inset-0 z-0 pointer-events-none bg-slate-950">
                        <div className="absolute inset-0 opacity-[0.03]" 
                             style={{ 
                               backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                               backgroundSize: '40px 40px' 
                             }}>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-slate-900/50 to-slate-900"></div>
                    </div>

                    <div className="relative z-10 h-full">
                        <Suspense fallback={<Loading />}>
                            <Routes>
                                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={(u) => { setUser(u); localStorage.setItem('erapor_session', JSON.stringify(u)); }} />} />
                                <Route path="/*" element={
                                    <PrivateRoute user={user}>
                                        <MainLayout user={user!} onLogout={() => { setUser(null); localStorage.removeItem('erapor_session'); }} />
                                    </PrivateRoute>
                                } />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

// --- Layout Component (Internal) ---
const MainLayout = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        if (isMobile) setSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Users, label: "Data Siswa", path: "/students" },
        { icon: FileSpreadsheet, label: "Input Nilai", path: "/grades" },
        { icon: Table, label: "Leger Nilai", path: "/leger" },
        { icon: Printer, label: "Cetak Rapor", path: "/reports" },
    ];

    if (user.role === UserRole.ADMIN) menuItems.push({ icon: Settings, label: "Pengaturan", path: "/settings" });
    if (user.role === UserRole.TEACHER) menuItems.push({ icon: UserCog, label: "Profil Saya", path: "/profile" });

    const settings = storageService.getSettings();
    const isTeacher = user.role === UserRole.TEACHER;
    const teacherInfo = isTeacher && user.className ? settings.teachers?.[user.className] : null;
    const brandLogo = (isTeacher && teacherInfo?.photoUrl) ? teacherInfo.photoUrl : "https://iili.io/fd1ypnV.png";
    const brandTitle = isTeacher ? (teacherInfo?.name || user.name || "Wali Kelas") : "Administrator";
    const brandSubtitle = isTeacher ? (user.className || "SDN 22 MP") : "System Admin";

    return (
        <div className="flex h-screen overflow-hidden relative">
            <aside className={`
                fixed md:relative inset-y-0 left-0 z-50 h-full glass-panel border-r border-white/5 
                transition-transform duration-300 ease-out flex flex-col
                ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:w-0 md:translate-x-0'}
            `}>
                <div className="h-full flex flex-col w-64">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                             <div className="relative flex-shrink-0">
                                <div className={`absolute inset-0 ${isTeacher ? 'bg-white/10' : 'bg-cyan-500/20'} blur rounded-full`}></div>
                                <img src={brandLogo} alt="Logo" className={`relative w-9 h-9 ${isTeacher && teacherInfo?.photoUrl ? 'object-cover rounded-full' : 'object-contain'} z-10`} />
                            </div>
                            <div className="min-w-0">
                                <h1 className={`font-bold leading-none text-white font-tech tracking-wide ${isTeacher ? 'text-xs uppercase truncate' : 'text-lg'}`}>{brandTitle}</h1>
                                <p className="text-[10px] text-slate-400 font-medium tracking-wider truncate mt-1">{brandSubtitle}</p>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white md:hidden">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-3 flex-1 overflow-y-auto">
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm group
                                            ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}
                                        `}
                                    >
                                        <item.icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'} />
                                        <span className="tracking-wide">{item.label}</span>
                                        {isActive && <Sparkles size={12} className="ml-auto text-cyan-400/50" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-slate-900/30">
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium">
                            <LogOut size={18} />
                            <span>Keluar Sistem</span>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto h-full w-full relative z-10 scroll-smooth">
                <div className="p-4 sticky top-0 z-40 flex items-center justify-between md:hidden bg-slate-900/80 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-cyan-400 bg-slate-800 rounded-md border border-white/10">
                            <Menu size={20} />
                        </button>
                        <span className="font-tech font-bold text-white">{brandTitle}</span>
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">
                    {(!sidebarOpen && !isMobile) && (
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="fixed top-4 left-4 z-50 p-2 bg-slate-800/80 backdrop-blur text-cyan-400 rounded-md border border-white/10 shadow-lg hover:bg-slate-700 transition-colors"
                        >
                            <PanelLeftOpen size={20} />
                        </button>
                    )}
                    <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" /></div>}>
                        <Routes>
                            <Route path="/" element={<Dashboard user={user} />} />
                            <Route path="/students" element={<Students user={user} />} />
                            <Route path="/grades" element={<Grades user={user} />} />
                            <Route path="/leger" element={<Leger user={user} />} />
                            <Route path="/reports" element={<Reports user={user} />} />
                            <Route path="/settings" element={<AppSettings />} />
                            <Route path="/profile" element={<TeacherProfile user={user} />} />
                        </Routes>
                    </Suspense>
                </div>
            </main>
            
            {sidebarOpen && isMobile && <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-[2px]" onClick={() => setSidebarOpen(false)} />}
        </div>
    );
};

export default App;