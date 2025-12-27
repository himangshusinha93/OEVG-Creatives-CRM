import React, { useState } from 'react';
import { Asset, Freelancer, ServiceItem } from '../types';
import { Search, Filter, Plus, MoreHorizontal, EyeOff, Package, UserCheck, Camera } from 'lucide-react';

interface CatalogViewProps {
  assets: Asset[];
  freelancers: Freelancer[];
  packages: ServiceItem[];
  activeSubTab: string | null;
}

const CatalogView: React.FC<CatalogViewProps> = ({ assets, freelancers, packages, activeSubTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const renderTable = () => {
    switch (activeSubTab) {
      case 'products':
        return (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6 w-10"><input type="checkbox" className="rounded bg-transparent border-slate-700" /></th>
                <th className="px-10 py-6">Resource Asset</th>
                <th className="px-10 py-6">Category</th>
                <th className="px-10 py-6">Inventory ID</th>
                <th className="px-10 py-6">Daily Yield</th>
                <th className="px-10 py-6">Stock Status</th>
                <th className="px-10 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6"><input type="checkbox" className="rounded bg-transparent border-slate-700" /></td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 border border-white/5 group-hover:border-cyan-500/30 transition-all">
                        <Camera size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-base tracking-tight italic">{a.name}</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ref: {a.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{a.category}</td>
                  <td className="px-10 py-6 text-[11px] font-mono text-slate-500 uppercase">{a.id.slice(0, 8)}</td>
                  <td className="px-10 py-6 text-base font-black text-cyan-400 italic">₹{a.rentalRate.toLocaleString()}.00</td>
                  <td className="px-10 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${a.status === 'Available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {a.status === 'Available' ? 'Ready' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 text-slate-500 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"><EyeOff size={18} /></button>
                      <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><MoreHorizontal size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'freelancers':
        return (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6 w-10"><input type="checkbox" className="rounded bg-transparent border-slate-700" /></th>
                <th className="px-10 py-6">Personnel Profile</th>
                <th className="px-10 py-6">Core Competency</th>
                <th className="px-10 py-6">Tier Level</th>
                <th className="px-10 py-6">Standard Rate</th>
                <th className="px-10 py-6">State</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {freelancers.map(f => (
                <tr key={f.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6"><input type="checkbox" className="rounded bg-transparent border-slate-700" /></td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gradient-to-tr from-slate-800 to-slate-900 text-magenta-400 rounded-2xl flex items-center justify-center font-black text-lg border border-white/5 group-hover:border-magenta-500/30 transition-all">
                        {f.name.charAt(0)}
                      </div>
                      <span className="font-black text-white text-base tracking-tight italic">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.role}</td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 bg-magenta-500/10 text-magenta-400 border border-magenta-500/20 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-magenta-500/5">{f.level}</span>
                  </td>
                  <td className="px-10 py-6 text-base font-black text-cyan-400 italic">₹{f.ratePerDay.toLocaleString()}.00</td>
                  <td className="px-10 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${f.status === 'Available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'packages':
        return (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6">Solution Blueprint</th>
                <th className="px-10 py-6">Classification</th>
                <th className="px-10 py-6">Standard Yield</th>
                <th className="px-10 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {packages.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6 font-black text-white text-base tracking-tight italic">{p.name}</td>
                  <td className="px-10 py-6"><span className="px-4 py-1.5 bg-white/5 text-slate-400 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">{p.tier} Level</span></td>
                  <td className="px-10 py-6 font-black text-cyan-400 text-lg italic">₹{p.price.toLocaleString()}</td>
                  <td className="px-10 py-6 text-right"><button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><MoreHorizontal size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return <div className="p-24 text-center text-slate-600 italic font-black uppercase tracking-[0.3em]">Query specific sub-category for archival access</div>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{activeSubTab || 'Catalog Repository'}</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Universal Asset Ledger & Resource Terminal</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="p-3.5 glass-card text-slate-500 hover:text-cyan-400 border-white/5 rounded-2xl transition-all"><Filter size={20} /></button>
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 w-full max-w-xs shadow-inner">
            <Search size={18} className="text-slate-600" />
            <input 
              type="text" 
              placeholder="Filter archives..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-bold text-slate-300 placeholder:text-slate-700" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-gradient-to-tr from-cyan-600 to-blue-600 hover:scale-105 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-cyan-500/10 active:scale-95 transition-all flex items-center gap-2 italic">
            <Plus size={18} /> Archive Record
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/5 overflow-hidden">
        {renderTable()}
      </div>
    </div>
  );
};

export default CatalogView;