
import React, { useState } from 'react';
import { User, UserRole, CLASSES } from '../types';
import { storageService } from '../services/storageService';
import { ShieldCheck, UserCircle, Cpu, Lock, Key, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'teacher' | 'admin'>('teacher');
    
    // Teacher Form State
    const [teacherClass, setTeacherClass] = useState(CLASSES[0]);
    const [teacherPassword, setTeacherPassword] = useState('');
    const [showTeacherPass, setShowTeacherPass] = useState(false);
    
    // Admin Form State
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [showAdminPass, setShowAdminPass] = useState(false);
    
    const [error, setError] = useState('');

    const handleTabChange = (tab: 'teacher' | 'admin') => {
        setActiveTab(tab);
        setError('');
        if (tab === 'teacher') {
            setAdminUsername('');
            setAdminPassword('');
            setShowAdminPass(false);
        } else {
            setTeacherPassword('');
            setShowTeacherPass(false);
        }
    };

    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const isValid = storageService.verifyTeacherLogin(teacherClass, teacherPassword);

        if (isValid) {
            const settings = storageService.getSettings();
            const teacherInfo = settings.teachers?.[teacherClass];
            const displayName = teacherInfo?.name ? teacherInfo.name : `Guru ${teacherClass}`;

            onLogin({
                username: teacherClass.replace(/\s+/g, '').toLowerCase(),
                role: UserRole.TEACHER,
                className: teacherClass,
                name: displayName
            });
        } else {
            setError('Akses Ditolak. Kode Otorisasi Salah.');
        }
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const inputUser = adminUsername.trim().toLowerCase();
        const inputPass = adminPassword.trim();

        if (inputUser === 'admin' && inputPass === 'admin') {
            const adminUser: User = {
                username: 'admin',
                role: UserRole.ADMIN,
                name: 'Administrator Utama',
                className: 'System Admin'
            };
            onLogin(adminUser);
        } else {
            setError('Kredensial Admin Tidak Valid. (Coba: admin / admin)');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
            {/* --- OPTIMIZED LIGHTWEIGHT BACKGROUND (CSS ONLY) --- */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Subtle Gradient Base */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
                
                {/* Cyber Grid Pattern - Very Light */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ 
                         backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }}>
                </div>

                {/* Ambient Glows (CSS Radial Gradients) - No Images */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* --- LOGIN CARD --- */}
            <div className="w-full max-w-md relative z-10 px-6">
                {/* Glass Panel Effect */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative">
                    {/* Top Decoration Line */}
                    <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>

                    <div className="p-8 pt-10">
                        {/* LOGO SECTION - CENTERED & GLOWING */}
                        <div className="flex justify-center mb-8 relative">
                            <div className="relative group cursor-default">
                                {/* Animated Glow Behind Logo */}
                                <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                                <img 
                                    src="https://iili.io/fd1ypnV.png" 
                                    alt="LOGO SDN 22 MP" 
                                    className="relative h-28 w-auto object-contain drop-shadow-2xl transform transition-transform duration-300 group-hover:scale-105" 
                                    loading="eager"
                                />
                            </div>
                        </div>

                        {/* TITLE SECTION */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white tracking-tight font-tech">
                                E-RAPOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">22</span>
                            </h1>
                            <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mt-1 font-medium">Sistem Penilaian Digital</p>
                        </div>

                        {/* TAB SWITCHER */}
                        <div className="grid grid-cols-2 gap-1 bg-slate-950/50 p-1 rounded-lg mb-6 border border-white/5">
                            <button
                                type="button"
                                onClick={() => handleTabChange('teacher')}
                                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${
                                    activeTab === 'teacher' 
                                    ? 'bg-slate-800 text-cyan-400 shadow-lg shadow-cyan-900/20 border border-white/5' 
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                            >
                                <UserCircle size={16} />
                                Guru
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTabChange('admin')}
                                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${
                                    activeTab === 'admin' 
                                    ? 'bg-slate-800 text-violet-400 shadow-lg shadow-violet-900/20 border border-white/5' 
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                            >
                                <ShieldCheck size={16} />
                                Admin
                            </button>
                        </div>

                        {/* FORMS */}
                        <div className="min-h-[220px]"> {/* Min height to prevent layout shift */}
                            {activeTab === 'teacher' ? (
                                <form onSubmit={handleTeacherLogin} className="space-y-4 animate-fade-in">
                                    <div className="group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <Cpu size={18} />
                                            </div>
                                            <select 
                                                name="teacherClass"
                                                className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer hover:bg-slate-900"
                                                value={teacherClass}
                                                onChange={(e) => { setTeacherClass(e.target.value); setError(''); }}
                                            >
                                                {CLASSES.map(c => <option key={c} value={c} className="bg-slate-900 py-2">{c}</option>)}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                                                <Key size={18} />
                                            </div>
                                            <input 
                                                type={showTeacherPass ? "text" : "password"}
                                                className="block w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                                placeholder="Kode Akses"
                                                value={teacherPassword}
                                                onChange={(e) => { setTeacherPassword(e.target.value); setError(''); }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowTeacherPass(!showTeacherPass)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-cyan-400 transition-colors"
                                            >
                                                {showTeacherPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {error && (
                                        <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-pulse">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                            {error}
                                        </div>
                                    )}

                                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-900/20 transition-all duration-200 transform active:scale-[0.98] text-sm tracking-wide uppercase mt-2">
                                        Masuk Sistem
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleAdminLogin} className="space-y-4 animate-fade-in">
                                    <div className="group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                                <UserCircle size={18} />
                                            </div>
                                            <input 
                                                type="text"
                                                autoComplete="username"
                                                className="block w-full pl-10 pr-3 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                                placeholder="ID Admin"
                                                value={adminUsername}
                                                onChange={(e) => { setAdminUsername(e.target.value); setError(''); }}
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input 
                                                type={showAdminPass ? "text" : "password"}
                                                autoComplete="current-password"
                                                className="block w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                                placeholder="Kata Sandi"
                                                value={adminPassword}
                                                onChange={(e) => { setAdminPassword(e.target.value); setError(''); }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowAdminPass(!showAdminPass)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-violet-400 transition-colors"
                                            >
                                                {showAdminPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs animate-pulse">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                            {error}
                                        </div>
                                    )}

                                    <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-violet-900/20 transition-all duration-200 transform active:scale-[0.98] text-sm tracking-wide uppercase mt-2">
                                        Akses Admin
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                    
                    {/* Footer Decoration */}
                    <div className="bg-slate-950/50 p-3 border-t border-white/5 text-center">
                        <p className="text-[10px] text-slate-600 font-mono">SDN 22 MUARA PADANG • VER 2.2</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
