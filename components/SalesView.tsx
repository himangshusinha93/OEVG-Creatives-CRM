import React, { useState } from 'react';
import { Quotation, Order, Client, ServiceItem, Freelancer, Asset, SystemLog, Coupon } from '../types';
import QuotationView from './QuotationView';
import { Search, Plus, Filter, CreditCard, Clock, CheckCircle, Ticket, X, Trash2 } from 'lucide-react';

interface SalesViewProps {
  quotations: Quotation[];
  orders: Order[];
  clients: Client[];
  services: ServiceItem[];
  contractors: Freelancer[];
  assets: Asset[];
  onAddQuotation: (q: Quotation) => void;
  onEditQuotation: (q: Quotation) => void;
  onDeleteQuotation: (id: string) => void;
  coupons: Coupon[];
  onAddCoupon: (c: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  logs: SystemLog[];
  activeSubTab: string | null;
}

const SalesView: React.FC<SalesViewProps> = (props) => {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Coupon>({ code: '', discountType: 'Percentage', value: 0, expiry: '' });

  if (props.activeSubTab === 'quotations') {
    return <QuotationView {...props} />;
  }

  const renderOrders = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Sales Velocity</p>
             <h3 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-cyan-400 transition-colors">₹4,50,000</h3>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full"></div>
          </div>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Pipeline</p>
             <h3 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-magenta-400 transition-colors">{props.orders.length} Units</h3>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-magenta-500/5 blur-3xl rounded-full"></div>
          </div>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Yield Average</p>
             <h3 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-indigo-400 transition-colors">₹85,000</h3>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full"></div>
          </div>
       </div>

       <div className="glass-card rounded-[3rem] shadow-2xl border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
             <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Commercial Order Feed</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6">Order ID</th>
                <th className="px-10 py-6">Client Target</th>
                <th className="px-10 py-6">Status Protocol</th>
                <th className="px-10 py-6">Fiscal Total</th>
                <th className="px-10 py-6">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {props.orders.map(o => (
                 <tr key={o.id} className="hover:bg-white/[0.02] transition-all group">
                   <td className="px-10 py-6 font-mono text-sm text-slate-500">#ORD-{o.id}</td>
                   <td className="px-10 py-6 font-black text-white text-base tracking-tight italic">{o.clientName}</td>
                   <td className="px-10 py-6">
                      <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{o.status}</span>
                   </td>
                   <td className="px-10 py-6 font-black text-white text-lg tracking-tighter italic">₹{o.budget.toLocaleString()}</td>
                   <td className="px-10 py-6">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                         <Clock size={12} /> Pending Settlement
                      </span>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
       </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {props.coupons.map(c => (
         <div key={c.code} className="glass-card p-10 rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center text-center relative group hover:border-cyan-500/30 transition-all">
            <button onClick={() => props.onDeleteCoupon(c.code)} className="absolute top-6 right-6 p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
            <div className="w-16 h-16 bg-white/5 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
               <Ticket size={32} />
            </div>
            <h4 className="text-3xl font-black text-white italic tracking-tighter mb-1 uppercase">{c.code}</h4>
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-6">{c.value}{c.discountType === 'Percentage' ? '%' : ' ₹'} OFF • {c.discountType}</p>
            <div className="px-6 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
               Live Until {c.expiry}
            </div>
         </div>
       ))}
       <button 
        onClick={() => setIsCouponModalOpen(true)}
        className="glass-card border-2 border-dashed border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-slate-500 hover:bg-white/5 hover:border-cyan-400 hover:text-cyan-400 transition-all group shadow-inner"
       >
          <Plus size={48} className="mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Generate Discount Matrix</span>
       </button>

       {isCouponModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in">
            <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl border-white/10 animate-in zoom-in duration-200 overflow-hidden">
              <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
                <h3 className="text-xl font-black uppercase tracking-tight italic">Issue Discount Protocol</h3>
                <button onClick={() => setIsCouponModalOpen(false)}><X size={24} /></button>
              </div>
              <div className="p-10 space-y-6">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Lexicon Code</label>
                  <input type="text" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-white uppercase" placeholder="e.g. FLASH50" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Value</label>
                    <input type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-white" value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Modality</label>
                    <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-white appearance-none" value={newCoupon.discountType} onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value as any})}>
                      <option value="Percentage">Percentage %</option>
                      <option value="Fixed">Fixed Amount ₹</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Void Timestamp</label>
                  <input type="date" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-white" value={newCoupon.expiry} onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})} />
                </div>
                <button 
                  onClick={() => { props.onAddCoupon(newCoupon); setIsCouponModalOpen(false); }}
                  className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl transition-all active:scale-95 italic text-[11px] tracking-widest"
                >
                  Authorize Coupon
                </button>
              </div>
            </div>
          </div>
       )}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{props.activeSubTab || 'Sales Hub'}</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Conversion Engine & Revenue Operations Hub</p>
       </div>
       {props.activeSubTab === 'orders' ? renderOrders() : props.activeSubTab === 'coupons' ? renderCoupons() : renderOrders()}
    </div>
  );
};

export default SalesView;