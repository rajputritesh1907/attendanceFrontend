import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { toast } from 'react-hot-toast';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskSkeleton } from './Skeleton';

const TaskSection = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await taskService.getTasks();
            setTasks(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load tasks');
            setLoading(false);
        }
    };

    const handleComplete = async (id) => {
        try {
            await taskService.updateTask(id, { status: 'completed' });
            toast.success('Task marked as completed!');
            fetchTasks(); // Refresh to move pending to in-progress if needed
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const isDeadlineSoon = (date) => {
        if (!date) return false;
        const diff = new Date(date) - new Date();
        return diff > 0 && diff < 86400000; // less than 24 hours
    };

    const isOverdue = (date, status) => {
        if (!date || status === 'completed') return false;
        return new Date(date) < new Date();
    };

    if (loading) return <TaskSkeleton />;

    const activeTasks = tasks.filter(t => t.status === 'in-progress');
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="space-y-10">
            {/* Active Task (The big one) */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-indigo-400" size={20} />
                    <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300">Currently Active</h3>
                </div>

                {activeTasks.length > 0 ? (
                    <div className="grid gap-6">
                        {activeTasks.map(task => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`relative overflow-hidden p-8 rounded-3xl glass-morphism border-l-4 ${isDeadlineSoon(task.dueDate) ? 'border-l-amber-500' : 'border-l-indigo-500'}`}
                            >
                                {isDeadlineSoon(task.dueDate) && (
                                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl flex items-center gap-1">
                                        <AlertCircle size={10} /> DEADLINE APPROACHING
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-[var(--text-main)]">{task.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{task.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm font-medium">
                                            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isOverdue(task.dueDate, task.status) ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5'}`}>
                                                <Clock size={14} /> Due: {new Date(task.dueDate).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 overflow-hidden">
                                        <button
                                            onClick={() => handleComplete(task._id)}
                                            className="bg-indigo-600 hover:bg-indigo-500 px-6 md:px-8 py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transform transition-all hover:scale-105 active:translate-y-1 w-full sm:w-auto"
                                        >
                                            <CheckCircle size={20} /> <span className="whitespace-nowrap">Complete Task</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center glass-morphism rounded-3xl border-dashed border-2 border-white/5 opacity-50">
                        <p className="text-slate-400 italic">No tasks active. You're all caught up!</p>
                    </div>
                )}
            </div>

            {/* Pending Queue */}
            {pendingTasks.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-slate-400" size={20} />
                        <h3 className="text-lg font-bold uppercase tracking-widest text-slate-400">Task Queue (Pending)</h3>
                    </div>
                    <div className="space-y-4">
                        {pendingTasks.map(task => (
                            <div key={task._id} className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-slate-200">{task.title}</h5>
                                    <p className="text-xs text-slate-500 mt-1">Will activate once current work is finished</p>
                                </div>
                                <div className="text-xs font-mono text-slate-500">
                                    EST: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* History Link/Summary */}
            {completedTasks.length > 0 && (
                <div className="pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center text-slate-500 text-sm italic">
                        <span>Success: {completedTasks.length} missions accomplished</span>
                        <div className="flex gap-1 h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskSection;
