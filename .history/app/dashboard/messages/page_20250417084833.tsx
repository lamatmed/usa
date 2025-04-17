'use client';
import { useState } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import { BsRobot, BsPerson, BsLightbulb } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBox() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) {
                setResponse(data.error || 'Une erreur est survenue');
            } else {
                setResponse(data.response);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setResponse("Erreur de connexion avec l'API");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 h-full flex flex-col rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 mb-8"
            >
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                    <BsRobot className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Assistant IA
                </h1>
            </motion.div>

            <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                {response ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4"
                    >
                        <div className="flex-shrink-0 mt-1">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BsRobot className="text-blue-600 text-xl" />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 text-gray-800 flex-1 border border-gray-200 shadow-sm backdrop-blur-sm bg-opacity-70">
                            {response}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center h-64 text-center p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-gray-200 shadow-inner"
                    >
                        <div className="p-4 bg-blue-100 rounded-full mb-4 shadow-inner">
                            <BsLightbulb className="text-blue-500 text-3xl" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Comment puis-je vous aider ?</h2>
                        <p className="text-gray-500 mt-2 max-w-md">Posez-moi une question et je ferai de mon mieux pour y répondre.</p>
                    </motion.div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Écrivez votre message ici..."
                        className="w-full p-5 pr-14 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-gray-700 bg-white bg-opacity-70 resize-none placeholder-gray-400 shadow-sm transition-all duration-200"
                        rows={3}
                        disabled={loading}
                    />
                    <motion.button
                        whileHover={!loading && prompt.trim() ? { scale: 1.05 } : {}}
                        whileTap={!loading && prompt.trim() ? { scale: 0.95 } : {}}
                        onClick={handleSubmit}
                        disabled={loading || !prompt.trim()}
                        className={`absolute right-4 bottom-4 p-3 rounded-xl ${loading || !prompt.trim() ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'} transition-all duration-200`}
                        aria-label="Envoyer le message"
                    >
                        {loading ? (
                            <FiLoader className="animate-spin text-xl" />
                        ) : (
                            <FiSend className="text-xl" />
                        )}
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-gray-600 flex items-start gap-3 bg-blue-50 bg-opacity-50 p-3 rounded-xl border border-blue-100"
                >
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <BsPerson className="text-blue-500" />
                    </div>
                    <span>Les réponses peuvent contenir des erreurs. Vérifiez les informations importantes.</span>
                </motion.div>
            </div>
        </div>
    );
}