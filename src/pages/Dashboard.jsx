import { useAuth } from '../context/AuthContext';
import AttendanceButton from '../components/AttendanceButton';
import TaskSection from '../components/TaskSection';
import { LogOut, User, Bell, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="min-h-screen">
            <nav className="glass-panel border-b-0 sticky top-0 z-[100] py-4 px-4 md:px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                            <User className="text-white" size={20} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-white truncate text-sm md:text-base">{user?.name}</h4>
                            <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role} Account</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium text-white">{formatTime(currentTime)}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none mt-1">{formatDate(currentTime)}</span>
                        </div>
                        <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium text-sm md:text-base">
                            <LogOut size={18} /> <span className="hidden xs:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </nav>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logout}
                title="End Session?"
                message="Are you sure you want to sign out from your workspace?"
                confirmText="Sign Out"
            />

            <main className="container mx-auto px-6 py-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">Work Workspace</h1>
                        <p className="text-slate-400 text-sm md:text-base">Manage performance, attendance, and deadlines.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Attendance Card */}
                        <div className="lg:col-span-1">
                            <AttendanceButton />
                        </div>

                        {/* Task Section */}
                        <div className="lg:col-span-2">
                            <TaskSection />
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
