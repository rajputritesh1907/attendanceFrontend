import { useState, useEffect } from 'react';
import { attendanceService } from '../services/api';
import { toast } from 'react-hot-toast';
import { LogIn, LogOut, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AttendanceSkeleton } from './Skeleton';
import ConfirmModal from './ConfirmModal';

const AttendanceButton = () => {
    const [status, setStatus] = useState(null); // null, 'checked-in', 'checked-out'
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [details, setDetails] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await attendanceService.getTodayStatus();
            if (res.data) {
                setDetails(res.data);
                if (res.data.checkOut) {
                    setStatus('checked-out');
                } else {
                    setStatus('checked-in');
                }
            } else {
                setStatus('not-checked-in');
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load status');
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        setActionLoading(true);
        try {
            const res = await attendanceService.checkIn();
            setDetails(res.data);
            setStatus('checked-in');
            toast.success('Successfully checked in!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check-in failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setActionLoading(true);
        try {
            const res = await attendanceService.checkOut();
            setDetails(res.data);
            setStatus('checked-out');
            toast.success('Shift completed. Checked out.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Check-out failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <AttendanceSkeleton />;
    }

    return (
        <div className="glass-panel p-6 md:p-8 rounded-[32px] space-y-8 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="text-indigo-400" /> Attendance Control
            </h3>

            <div className="space-y-6">
                {status === 'not-checked-in' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-slate-400 mb-6 text-center text-sm">You haven't checked in for today yet.</p>
                        <button
                            onClick={handleCheckIn}
                            disabled={actionLoading}
                            className="bg-indigo-600 hover:bg-indigo-500 w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
                            Check In Now
                        </button>
                    </motion.div>
                )}

                {status === 'checked-in' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                        <div className="bg-emerald-500/10 text-emerald-400 py-3 rounded-xl border border-emerald-500/20 inline-block px-4 mx-auto font-medium">
                            Status: Active On Duty
                        </div>
                        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Shift Started At</p>
                            <p className="text-xl font-mono font-bold text-slate-900 dark:text-[var(--text-main)]">{new Date(details.checkIn).toLocaleTimeString()}</p>
                        </div>
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={actionLoading}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-base transition-all disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
                            End Shift
                        </button>

                        <ConfirmModal
                            isOpen={isConfirmOpen}
                            onClose={() => setIsConfirmOpen(false)}
                            onConfirm={handleCheckOut}
                            title="End Work Shift?"
                            message="Are you sure you want to end your current shift? This will record your check-out time."
                            confirmText="End Shift"
                        />
                    </motion.div>
                )}

                {status === 'checked-out' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h4 className="text-lg font-bold">Shift Ended</h4>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-white/5">
                                <p className="text-[10px] text-slate-500 mb-1">STAYED FROM</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(details.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-white/5">
                                <p className="text-[10px] text-slate-500 mb-1">UNTIL</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(details.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 pt-4 border-t border-white/5">Great work today! See you tomorrow.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AttendanceButton;
