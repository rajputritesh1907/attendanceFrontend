import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Users, Plus, Trash2, Briefcase, Clock, AlertCircle, LogOut, LayoutDashboard, UserCheck, CheckCircle2, ListTodo, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [users, setUsers] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // users, addTask, tasks

    // Form states
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
    const [newTask, setNewTask] = useState({ userId: '', title: '', description: '', dueDate: '' });

    // Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [usersRes, tasksRes] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getAllTasks()
            ]);
            setUsers(usersRes.data);
            setAllTasks(tasksRes.data);
        } catch (error) {
            toast.error('Failed to sync data');
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await adminService.getAllTasks();
            setAllTasks(res.data);
        } catch (error) {
            toast.error('Failed to update tasks');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await adminService.addUser(newUser);
            toast.success('Member added successfully');
            setNewUser({ name: '', email: '', password: '', role: 'user' });
            const res = await adminService.getAllUsers();
            setUsers(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleDeleteUser = async (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Terminate Access?',
            message: 'Are you sure you want to permanently remove this member? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await adminService.deleteUser(id);
                    toast.success('Personnel removed');
                    setUsers(users.filter(u => u._id !== id));
                } catch (error) {
                    toast.error('System error during termination');
                }
            }
        });
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            await adminService.assignTask(newTask);
            toast.success('Objective deployed');
            setNewTask({ userId: '', title: '', description: '', dueDate: '' });
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Deployment failed');
        }
    };

    const handleDeleteTask = async (taskId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Cancel Objective?',
            message: 'Are you sure you want to permanently cancel this objective? It will be removed from system records.',
            onConfirm: async () => {
                try {
                    await adminService.deleteTask(taskId);
                    toast.success('Objective cancelled');
                    allTasks.filter(t => t._id !== taskId);
                    setAllTasks(allTasks.filter(t => t._id !== taskId));
                } catch (error) {
                    toast.error('Failed to remove task');
                }
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'in-progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Navigation */}
            <nav className="glass-panel border-b-0 border-x-0 border-t-0 sticky top-0 z-[100] py-4 px-6 md:px-12 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight hidden sm:block text-[var(--text-main)]">Command Center</h1>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-none">Global Control</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:block text-slate-500 text-sm italic">Accessing as <span className="text-white font-bold">{user?.name}</span></span>
                        <button
                            onClick={() => setConfirmModal({
                                isOpen: true,
                                title: 'Terminate Session?',
                                message: 'Are you sure you want to exit the Command Center?',
                                onConfirm: logout,
                                confirmText: 'Exit Session'
                            })}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl transition-all font-bold text-xs"
                        >
                            <LogOut size={16} /> EXIT SESSION
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Controls */}
                    <aside className="lg:col-span-1 space-y-4">
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-3 no-scrollbar [&::-webkit-scrollbar]:hidden">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex-shrink-0 lg:w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'glass-panel text-slate-500 hover:text-white'}`}
                            >
                                <Users size={20} /> <span className="text-sm md:text-base whitespace-nowrap">PERSONNEL</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('addTask')}
                                className={`flex-shrink-0 lg:w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'addTask' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'glass-panel text-slate-500 hover:text-white'}`}
                            >
                                <Plus size={20} /> <span className="text-sm md:text-base whitespace-nowrap">DEPLOY TASK</span>
                            </button>
                            <button
                                onClick={() => { setActiveTab('tasks'); fetchTasks(); }}
                                className={`flex-shrink-0 lg:w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl transition-all font-bold ${activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'glass-panel text-slate-500 hover:text-white'}`}
                            >
                                <ListTodo size={20} /> <span className="text-sm md:text-base whitespace-nowrap">MONITORING</span>
                            </button>
                        </div>

                        {/* Summary Block */}
                        <div className="hidden sm:block glass-panel p-8 rounded-[32px] mt-8 bg-gradient-to-b from-white/[0.03] to-transparent">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">Asset Analytics</h4>
                            <div className="space-y-8">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Personnel</p>
                                        <p className="text-2xl font-extrabold text-white">{users.length}</p>
                                    </div>
                                    <Users className="text-slate-700 mb-1" size={24} />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Operations</p>
                                        <p className="text-2xl font-extrabold text-emerald-400">{allTasks.length}</p>
                                    </div>
                                    <Briefcase className="text-slate-700 mb-1" size={24} />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Success Rate</p>
                                        <p className="text-2xl font-extrabold text-indigo-400">
                                            {allTasks.length ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100) : 0}%
                                        </p>
                                    </div>
                                    <CheckCircle2 className="text-slate-700 mb-1" size={24} />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Interface Area */}
                    <main className="lg:col-span-3 min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'users' && (
                                <motion.div
                                    key="users"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Directory Header with Add User UI */}
                                    <section className="glass-panel p-8 rounded-[40px] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                            <div>
                                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                                                    <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                                    Registry Management
                                                </h2>
                                                <p className="text-slate-400 text-sm mt-1">Onboard and manage organizational personnel</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                                            <input
                                                type="text"
                                                placeholder="Legal Name"
                                                value={newUser.name}
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                required
                                                className="input-field py-4 text-sm font-bold bg-slate-900/50 text-white"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Official Email"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                required
                                                className="input-field py-4 text-sm font-bold bg-slate-900/50 text-white"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Encrypted Entry"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                required
                                                className="input-field py-4 text-sm font-bold bg-slate-900/50 text-white"
                                            />
                                            <button type="submit" className="bg-white text-slate-900 hover:bg-indigo-100 font-bold rounded-2xl transition-all shadow-xl shadow-white/5 uppercase tracking-tighter text-sm">
                                                ADD MEMBER
                                            </button>
                                        </form>
                                    </section>

                                    {/* Personnel List */}
                                    <section className="glass-panel rounded-[40px] overflow-hidden border-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-white/[0.02]">
                                                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-500">
                                                        <th className="py-6 px-10">Member Instance</th>
                                                        <th className="py-6 px-10">Access Link</th>
                                                        <th className="py-6 px-10">Clearance</th>
                                                        <th className="py-6 px-10 text-right">Operation</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {users.map(u => (
                                                        <tr key={u._id} className="hover:bg-white/[0.01] transition-colors group">
                                                            <td className="py-6 px-10">
                                                                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{u.name}</div>
                                                                <div className="text-[10px] text-slate-500 dark:text-slate-600 mt-1 uppercase font-bold">UID: {u._id.substring(0, 8)}</div>
                                                            </td>
                                                            <td className="py-6 px-10 text-slate-400 font-mono text-sm">{u.email}</td>
                                                            <td className="py-6 px-10">
                                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
                                                                    {u.role === 'admin' ? 'System Admin' : u.role}
                                                                </span>
                                                            </td>
                                                            <td className="py-6 px-10 text-right">
                                                                {u._id !== user?._id ? (
                                                                    <button
                                                                        onClick={() => handleDeleteUser(u._id)}
                                                                        className="p-3 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[10px] font-black text-indigo-500/40 uppercase pr-2">Self</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === 'addTask' && (
                                <motion.div
                                    key="addTask"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-3xl mx-auto py-4"
                                >
                                    <div className="glass-panel p-10 rounded-[48px] bg-gradient-to-tr from-indigo-900/10 to-transparent">
                                        <div className="mb-12 text-center">
                                            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30 animate-pulse-slow">
                                                <Briefcase className="text-white" size={32} />
                                            </div>
                                            <h2 className="text-3xl font-extrabold tracking-tighter">Objective Deployment</h2>
                                            <p className="text-slate-500 mt-3 font-medium">Define and assign mission-critical tasks</p>
                                        </div>

                                        <form onSubmit={handleAssignTask} className="space-y-10">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Asset Allocation</label>
                                                    <select
                                                        value={newTask.userId}
                                                        onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
                                                        required
                                                        className="w-full bg-slate-900 border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select Personnel...</option>
                                                        {users.filter(u => u.role === 'user').map(u => (
                                                            <option key={u._id} value={u._id}>{u.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Time Constraint</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={newTask.dueDate}
                                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                                        required
                                                        className="w-full bg-slate-900 border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mission Identifier</label>
                                                <input
                                                    type="text"
                                                    placeholder="Task Subject Title..."
                                                    value={newTask.title}
                                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                    required
                                                    className="input-field py-5 px-8 font-bold text-lg bg-slate-900 border-white/5 text-white"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Briefing Content</label>
                                                <textarea
                                                    placeholder="Detailed operational instructions..."
                                                    value={newTask.description}
                                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                    required
                                                    className="w-full h-40 bg-slate-900 border-white/5 rounded-[32px] py-6 px-8 text-white outline-none focus:border-indigo-500/50 transition-all resize-none font-medium leading-relaxed"
                                                ></textarea>
                                            </div>

                                            <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-3xl flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <AlertCircle className="text-indigo-400" size={20} />
                                                </div>
                                                <p className="text-xs text-indigo-400/80 leading-relaxed font-bold italic">
                                                    LOGIC GATE: If personnel has an active operation, this deployment will be queued as 'PENDING' automatically.
                                                </p>
                                            </div>

                                            <button type="submit" className="w-full bg-white text-slate-950 hover:bg-indigo-50 font-bold py-6 rounded-[32px] shadow-2xl shadow-indigo-500/10 transition-all active:scale-[0.98] text-lg uppercase tracking-tighter">
                                                DEPLOY OBJECTIVE
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'tasks' && (
                                <motion.div
                                    key="tasks"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-4">
                                                <span className="w-3 h-10 bg-emerald-500 rounded-full"></span>
                                                Operational Monitor
                                            </h2>
                                            <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">Live Task Streaming & Surveillance</p>
                                        </div>
                                        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                                            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest">Global</button>
                                            <button className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">By Asset</button>
                                        </div>
                                    </div>

                                    {/* Task List Grid */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {allTasks.length === 0 ? (
                                            <div className="glass-panel p-20 rounded-[40px] text-center border-dashed border-2 border-white/5">
                                                <Filter className="mx-auto text-slate-800 mb-6" size={64} />
                                                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Active Operations Found</p>
                                            </div>
                                        ) : (
                                            allTasks.map((task) => (
                                                <motion.div
                                                    layout
                                                    key={task._id}
                                                    className="glass-panel p-8 rounded-[32px] group hover:border-white/10 transition-all border border-white/5"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                                        <div className="flex gap-6">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getStatusColor(task.status)}`}>
                                                                {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                                                                        {task.status}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                                                                        <CalendarIcon size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{task.title}</h4>
                                                                <div className="flex items-center gap-2 mt-3 text-sm">
                                                                    <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                                                        <UserCheck className="text-indigo-400" size={12} />
                                                                    </div>
                                                                    <span className="text-slate-400 font-bold uppercase text-[11px] tracking-tight">Assigned to: <span className="text-white">{task.user?.name || 'Unknown'}</span></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
                                                            <div className="hidden md:block text-right mr-4">
                                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deadline Context</p>
                                                                <p className={`text-xs font-bold ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : 'text-slate-400'}`}>
                                                                    {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {Math.abs(Math.floor((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))} Days Left
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                className="p-4 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-2xl transition-all border border-red-500/0 hover:border-red-500/20"
                                                                title="Cancel Operation"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Description Expandable Style */}
                                                    <div className="mt-6 pt-6 border-t border-white/5 overflow-hidden">
                                                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                                            {task.description || "No tactical briefing provided for this operation."}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Aesthetic Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant || 'danger'}
            />
        </div >
    );
};

export default AdminDashboard;
