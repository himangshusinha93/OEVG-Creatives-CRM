import React, { useState } from 'react';
import { User, Shield, Lock, Key, LogIn, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginViewProps {
  onLogin: (user: UserType) => void;
}

const MOCK_USERS = [
  { username: 'SystemAdmin', password: 'Admin00', name: 'System Admin', role: 'Root Admin' },
  { username: 'creative', password: 'password', name: 'Creative Lead', role: 'Director' }
];

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Artificial delay for realism
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin({
          username: user.username,
          name: user.name,
          role: user.role
        });
      } else {
        setError('Invalid identity credentials. Access denied.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050811] p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] rounded-full"></div>

      <div className="glass-card w-full max-w-md p-10 rounded-[3rem] shadow-2xl border-white/10 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center font-black text-white italic text-3xl shadow-lg shadow-cyan-500/20 mb-6">
            O
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">OEVG Creatives</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">CRM</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-cyan-400 transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-700 transition-all"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-magenta-400 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-magenta-500 focus:outline-none font-bold text-white placeholder:text-slate-700 transition-all"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl shadow-cyan-500/10 active:scale-95 transition-all text-xs tracking-[0.2em] italic flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={18} />
                Initialize Access
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-slate-600">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
            <Shield size={12} className="text-cyan-500" />
            End-to-End Encrypted Session
          </div>
          <div className="text-[9px] font-medium text-slate-700 uppercase tracking-widest text-center">
            Restricted System. Unauthorized access is <br/> 
            subject to protocols.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;