import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Bot } from 'lucide-react';
import { generateAssistantResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Greeting initialized. I am the LensCraft AI Protocol. How shall we optimize your agency today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await generateAssistantResponse(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural connection severed. Query lost in transit." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 w-[420px] glass-card rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-8 duration-500 h-[600px]">
      {/* Header */}
      <div className="bg-[#0a0c1a] p-6 flex justify-between items-center border-b border-white/5 relative overflow-hidden shrink-0">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-10 h-10 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <span className="font-black text-white uppercase italic tracking-tighter text-lg">AI Studio</span>
            <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-0.5">Neural Synthesis Active</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/5 p-2 rounded-full transition-all text-slate-500 hover:text-white relative z-10">
          <X size={24} />
        </button>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Sparkles size={120} className="text-cyan-400" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-900/40 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-5 rounded-[1.8rem] text-[13px] leading-relaxed shadow-xl border ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-cyan-500/10 rounded-br-none italic font-bold' 
                  : 'bg-white/5 border-white/5 text-slate-300 rounded-bl-none italic font-medium'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/5 p-4 rounded-[1.5rem] rounded-bl-none shadow-xl">
              <Loader2 size={18} className="animate-spin text-cyan-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-[#0a0c1a] border-t border-white/5 shrink-0 shadow-2xl">
        <div className="flex items-center space-x-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-2.5 focus-within:border-cyan-500/50 focus-within:ring-4 focus-within:ring-cyan-500/5 transition-all group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the Archive..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-white placeholder:text-slate-700 uppercase tracking-tight"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-700 font-black uppercase tracking-widest mt-4 italic opacity-50">
          System encrypted • LensCraft Neural Terminal
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;