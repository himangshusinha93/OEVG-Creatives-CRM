import React, { useState } from 'react';
import { Invoice } from '../types';
import { DollarSign, ArrowUpRight, ArrowDownRight, FileText, Download, MoreVertical, CreditCard, TrendingUp, AlertCircle, X, Plus } from 'lucide-react';

interface FinancesViewProps {
  invoices: Invoice[];
  onAddInvoice: (inv: Invoice) => void;
  onNotify: (text: string) => void;
}

const FinancesView: React.FC<FinancesViewProps> = ({ invoices, onAddInvoice, onNotify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInv, setNewInv] = useState({ client: '', amount: 0, status: 'Pending' as any });

  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Overdue': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Draft': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-white/5';
    }
  };

  const submitAdd = () => {
    onAddInvoice({
      id: `INV-${Math.floor(Math.random() * 900) + 100}`,
      clientName: newInv.client,
      amount: Number(newInv.amount),
      date: new Date().toISOString().split('T')[0],
      status: newInv.status
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-[2rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20"><TrendingUp size={24} /></div>
            <span className="flex items-center text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
              <ArrowUpRight size={14} className="mr-1" /> +14.2%
            </span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gross Collection</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">${totalPaid.toLocaleString()}</h3>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full"></div>
        </div>
        
        <div className="glass-card p-6 rounded-[2rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20"><CreditCard size={24} /></div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Pending Receivables</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">${totalPending.toLocaleString()}</h3>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/5 blur-3xl rounded-full"></div>
        </div>

        <div className="glass-card p-6 rounded-[2rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20"><AlertCircle size={24} /></div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Overdue Protocol</p>
          <h3 className="text-3xl font-black text-rose-500 mt-1 italic tracking-tighter">${totalOverdue.toLocaleString()}</h3>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 blur-3xl rounded-full"></div>
        </div>

        <div className="bg-gradient-to-tr from-[#0a0c1a] to-slate-900 p-6 rounded-[2rem] border border-white/10 shadow-2xl text-white relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-white/5 text-white rounded-2xl border border-white/10 shadow-xl"><DollarSign size={24} /></div>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Est. Tax Reserve</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">${(totalPaid * 0.15).toLocaleString()}</h3>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-magenta-500/10 blur-3xl rounded-full"></div>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-white/5 gap-6">
          <div>
            <h3 className="text-xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
              <FileText size={24} className="text-cyan-400" /> Revenue Ledger
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 ml-9">Fiscal Audit Gateway</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onNotify("CSV Archival Sequence Started")}
              className="px-6 py-2.5 glass-card border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all flex items-center gap-2 active:scale-95"
            >
              <Download size={16} /> Export Ledger
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95 italic"
            >
              + Issue Invoice
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6">Archive Ref</th>
                <th className="px-10 py-6">Entity Target</th>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6 text-right">Aggregate Due</th>
                <th className="px-10 py-6 text-center">Status Protocol</th>
                <th className="px-10 py-6 text-right">Interactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-10 py-6 text-xs font-mono font-bold text-slate-500">{inv.id}</td>
                  <td className="px-10 py-6 font-black text-white italic text-base tracking-tight">{inv.clientName}</td>
                  <td className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">{inv.date}</td>
                  <td className="px-10 py-6 text-lg font-black text-cyan-400 text-right italic tracking-tighter">${inv.amount.toLocaleString()}</td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${getStatusColor(inv.status)} shadow-lg shadow-black/20`}>
                        {inv.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl border-white/10 animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Financial Issuance</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-cyan-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Entity Recipient</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-600"
                  placeholder="Target Client Name"
                  onChange={e => setNewInv({...newInv, client: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Archive Amount ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white"
                    onChange={e => setNewInv({...newInv, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">State Protocol</label>
                  <select 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                    onChange={e => setNewInv({...newInv, status: e.target.value as any})}
                  >
                    <option value="Pending" className="bg-slate-900">Pending</option>
                    <option value="Draft" className="bg-slate-900">Draft</option>
                    <option value="Paid" className="bg-slate-900">Paid</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={submitAdd}
                className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase mt-4 shadow-xl shadow-cyan-500/10 active:scale-95 transition-all text-[11px] tracking-[0.2em] italic"
              >
                Execute Issuance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesView;