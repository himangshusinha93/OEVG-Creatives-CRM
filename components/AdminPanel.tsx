import React from 'react';
import { Settings, Server, Activity, Database, AlertTriangle, Key, Clock } from 'lucide-react';
import { AgencyConfig } from '../types';

interface AdminPanelProps {
  config: AgencyConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgencyConfig>>;
  onReset: () => void;
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, setConfig, onReset, onNotify }) => {
  const auditLogs = [
    { time: 'Just Now', user: 'Admin', action: 'Accessed Master Panel', type: 'system' },
    { time: '10:45 AM', user: 'Admin', action: 'Modified Pricing Table', type: 'system' },
    { time: '09:12 AM', user: 'Admin', action: 'Approved Freelancer Payouts', type: 'finance' },
  ];

  const toggleConfig = (key: keyof AgencyConfig) => {
    const nextVal = !config[key];
    setConfig(prev => ({ ...prev, [key]: nextVal }));
    onNotify(`${key} protocol ${nextVal ? 'engaged' : 'disengaged'}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 text-white shadow-2xl border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Server className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Agency Control Kernel</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Operational Master Switch</p>
              </div>
            </div>
            <span className="flex items-center px-4 py-2 bg-white/5 text-cyan-400 rounded-2xl text-[10px] font-black border border-white/10 uppercase tracking-widest shadow-inner">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3 animate-pulse"></div>
              v2.5 Synchronized
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 relative z-10">
            <div className="space-y-3">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Storage Array</p>
              <p className="text-4xl font-black text-white italic tracking-tighter">94%</p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full w-[94%] neon-glow-cyan"></div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Response Latency</p>
              <p className="text-4xl font-black text-emerald-400 italic tracking-tighter">22<span className="text-sm">ms</span></p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[15%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Asset Volume</p>
              <p className="text-4xl font-black text-magenta-400 italic tracking-tighter">1.2<span className="text-sm">TB</span></p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-magenta-400 h-full rounded-full w-[60%] neon-glow-magenta"></div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Operational Uptime</p>
              <p className="text-4xl font-black text-white italic tracking-tighter">99.9%</p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-white h-full rounded-full w-[99%]"></div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="glass-card rounded-[3rem] p-8 border-white/5 shadow-2xl flex flex-col relative overflow-hidden bg-white/[0.02]">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center mb-8 italic">
            <Clock size={16} className="mr-3 text-cyan-500" />
            Security Log Feed
          </h4>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-start text-[11px] border-l-2 border-white/5 pl-5 py-1 hover:bg-white/5 transition-all rounded-r-xl group">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-black text-white uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{log.user}</span>
                    <span className="text-slate-600 font-mono text-[9px]">{log.time}</span>
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-tight italic">{log.action}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Activity size={120} className="text-cyan-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] p-10 border-white/5 shadow-2xl">
          <h4 className="text-sm font-black text-white mb-10 flex items-center uppercase tracking-[0.2em] italic border-b border-white/5 pb-4">
            <Settings size={20} className="mr-3 text-cyan-500" />
            Core System Modulation
          </h4>
          <div className="space-y-10">
            {[
              { id: 'publicPortfolio', label: 'Public Portfolio Engine', sub: 'Engage external asset broadcast' },
              { id: 'autoInvoicing', label: 'Autonomous Invoicing', sub: 'Deploy billing on closure event' },
              { id: 'aiScoping', label: 'AI Resource Intelligence', sub: 'Neural predictive asset allocation' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight italic group-hover:text-cyan-400 transition-colors">{item.label}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.sub}</p>
                </div>
                <button 
                  onClick={() => toggleConfig(item.id as keyof AgencyConfig)}
                  className={`w-14 h-8 rounded-2xl transition-all flex items-center px-1.5 shadow-inner ${config[item.id as keyof AgencyConfig] ? 'bg-cyan-600 justify-end neon-glow-cyan' : 'bg-white/5 border border-white/10 justify-start'}`}
                >
                  <div className="w-5 h-5 bg-white rounded-xl shadow-xl" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border-rose-500/10 shadow-2xl flex flex-col justify-between bg-rose-500/[0.02]">
          <div>
            <h4 className="text-sm font-black text-rose-500 mb-10 flex items-center uppercase tracking-[0.2em] italic border-b border-rose-500/10 pb-4">
                <AlertTriangle size={20} className="mr-3 text-rose-500" />
                Critical Override Terminal
            </h4>
            <div className="space-y-6">
                <button 
                    onClick={() => onNotify("Protocol Cache Purged")}
                    className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-rose-500/10 hover:border-rose-500/30 transition-all group shadow-inner"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-400">Flush Environment Cache</span>
                    <Activity size={18} className="text-slate-600 group-hover:text-rose-400" />
                </button>
                <button 
                    onClick={() => onNotify("Cryptographic Rotation Complete")}
                    className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group shadow-inner"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-cyan-400">Rotate Encryption Sequence</span>
                    <Key size={18} className="text-slate-600 group-hover:text-cyan-400" />
                </button>
            </div>
          </div>
          
          <button 
            onClick={onReset}
            className="w-full mt-10 p-5 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-rose-500/10 transition-all active:scale-95 flex items-center justify-center gap-4 italic"
          >
            <Database size={18} />
            Initialize Factory Data Wipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;