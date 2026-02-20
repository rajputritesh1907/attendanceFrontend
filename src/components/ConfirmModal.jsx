import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) => {
    if (!isOpen) return null;

    const accentColor = variant === 'danger' ? 'red' : 'indigo';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-panel w-full max-w-md p-8 rounded-[32px] relative z-10 shadow-2xl border border-white/10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 bg-${accentColor}-500/10 rounded-2xl flex items-center justify-center mb-6 border border-${accentColor}-500/20`}>
                                <AlertTriangle className={`text-${accentColor}-500`} size={32} />
                            </div>

                            <h3 className="text-xl font-black mb-3 tracking-tight text-slate-900 dark:text-[var(--text-main)]">{title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium text-sm">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold transition-all border border-slate-200 dark:border-white/5 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-6 py-4 rounded-2xl bg-${accentColor === 'red' ? 'red-500' : 'indigo-600'} hover:bg-${accentColor === 'red' ? 'red-600' : 'indigo-500'} text-white font-bold transition-all shadow-lg shadow-${accentColor}-500/20 text-sm`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
