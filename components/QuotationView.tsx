import React, { useState, useMemo } from 'react';
import { Quotation, Client, ServiceItem, Freelancer, Asset, SystemLog } from '../types';
import { 
  Plus, Send, X, FileText, Download, CheckCircle2, Search, Trash2, 
  Package, DollarSign, Camera, Users, 
  Clock, ShieldCheck, Zap, Crown, Calendar, History, Edit3, AlertCircle,
  Briefcase, ArrowRight, Sparkles, Loader2, Bot, Save, MoreVertical
} from 'lucide-react';
import { generateAiQuotation } from '../services/geminiService';

interface QuotationViewProps {
  quotations: Quotation[];
  clients: Client[];
  services: ServiceItem[];
  contractors: Freelancer[];
  assets: Asset[];
  onAddQuotation: (q: Quotation) => void;
  onEditQuotation: (q: Quotation) => void;
  onDeleteQuotation: (id: string) => void;
  logs: SystemLog[];
}

interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  type: 'catalog' | 'manual' | 'resource';
}

const QuotationView: React.FC<QuotationViewProps> = ({ 
  quotations, clients, services, contractors, assets, 
  onAddQuotation, onEditQuotation, onDeleteQuotation, logs 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState<any>(null);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectType, setProjectType] = useState<'Photography' | 'Videography' | 'Hybrid'>('Photography');
  const [projectTier, setProjectTier] = useState<'Standard' | 'Premium'>('Standard');
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);

  const resetForm = () => {
    setSelectedClientId('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setProjectType('Photography');
    setProjectTier('Standard');
    setLineItems([]);
    setEditingId(null);
    setIsModalOpen(false);
    setAiDraft(null);
  };

  const startEdit = (q: Quotation) => {
    setEditingId(q.id);
    setSelectedClientId(q.clientId);
    setStartDate(q.startDate);
    setEndDate(q.endDate);
    setProjectType(q.projectType);
    setProjectTier(q.tier);
    setLineItems(q.items.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      ...item,
      type: 'manual'
    })));
    setIsModalOpen(true);
  };

  const total = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [lineItems]);

  const addResourceToQuote = (name: string, price: number) => {
    const exists = lineItems.find(li => li.description === name);
    if (exists) {
      setLineItems(prev => prev.filter(li => li.id !== exists.id));
    } else {
      const newItem: QuoteLineItem = {
        id: Math.random().toString(36).substr(2, 9),
        description: name,
        quantity: 1,
        price,
        type: 'resource'
      };
      setLineItems(prev => [...prev, newItem]);
    }
  };

  const finalizeQuotation = (status: 'Sent' | 'Draft') => {
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    const payload: Quotation = {
      id: editingId || `QT-${Math.floor(Math.random() * 900) + 100}`,
      clientId: selectedClientId,
      clientName: client.name,
      date: new Date().toISOString().split('T')[0],
      startDate,
      endDate,
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      projectType,
      tier: projectTier,
      items: lineItems.map(({ description, quantity, price }) => ({ description, quantity, price })),
      totalAmount: total,
      status: status
    };

    if (editingId) onEditQuotation(payload);
    else onAddQuotation(payload);
    
    resetForm();
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Proposal Vault</h2>
          <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest">Active Quotation Engine</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#ff6b3d] text-white px-10 py-4 rounded-2xl flex items-center gap-3 text-sm font-black transition-all hover:scale-105 shadow-xl shadow-[#ff6b3d]/20 active:scale-95">
            <Plus size={20} /> Initialize Architect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quotations.map(q => (
          <div key={q.id} className="glass-card p-10 rounded-[2.5rem] shadow-2xl border-white/5 hover:border-[#ff6b3d]/30 transition-all group">
            <div className="flex justify-between items-start mb-10">
              <div className="p-4 bg-white/5 text-[#3c9cfd] rounded-2xl border border-white/5">
                <FileText size={28} />
              </div>
              <div className="flex gap-2">
                 <button onClick={() => startEdit(q)} className="p-2 text-slate-500 hover:text-white"><Edit3 size={18} /></button>
                 <button onClick={() => onDeleteQuotation(q.id)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={18} /></button>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  q.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  q.status === 'Sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {q.status}
                </span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">{q.clientName}</h3>
            <p className="text-3xl font-black text-[#ff6b3d] tracking-tighter mb-8">₹{q.totalAmount.toLocaleString()}</p>
            
            <div className="space-y-3 mb-10 bg-white/5 p-6 rounded-2xl border border-white/5">
              {q.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>{item.description}</span>
                  <span className="text-white">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Schedule</span>
                <span className="text-xs font-bold text-slate-300">{q.startDate} — {q.endDate}</span>
              </div>
              <button className="flex items-center gap-2 bg-white/5 text-white px-5 py-2.5 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all">
                <Download size={16} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="bg-[#151c2c] rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[95vh] animate-in zoom-in">
            
            <div className="p-8 bg-[#1a2235] text-white flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ff6b3d] rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase">{editingId ? 'Refining Proposal' : 'Architecting Quotation'}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Proposal ID: {editingId || 'New Protocol'}</p>
                </div>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X size={24} /></button>
            </div>
            
            <div className="p-12 overflow-y-auto custom-scrollbar flex-1 space-y-12">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Client</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:ring-2 focus:ring-[#ff6b3d] focus:outline-none transition-all appearance-none"
                    value={selectedClientId}
                    onChange={e => setSelectedClientId(e.target.value)}
                  >
                    <option value="" className="bg-[#1a2235]">Select Client...</option>
                    {clients.map(c => <option key={c.id} value={c.id} className="bg-[#1a2235]">{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Start Date</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:ring-2 focus:ring-[#ff6b3d] focus:outline-none transition-all" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">End Date</label>
                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold text-white focus:ring-2 focus:ring-[#ff6b3d] focus:outline-none transition-all" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <Package className="text-[#ff6b3d]" size={20} />
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Production Components</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.filter(s => s.pillar === (projectType as any)).map(s => (
                    <button 
                      key={s.id}
                      onClick={() => addResourceToQuote(s.planName, s.price)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        lineItems.find(li => li.description === s.planName) 
                        ? 'bg-[#ff6b3d]/10 border-[#ff6b3d] text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                      }`}
                    >
                      <p className="text-xs font-black uppercase mb-1">{s.planName}</p>
                      <p className="text-lg font-black text-white">₹{s.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-10 bg-[#1a2235] border-t border-white/5 flex justify-between items-center shrink-0">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Valuation</span>
                <span className="text-4xl font-black text-[#ff6b3d] tracking-tighter">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => finalizeQuotation('Draft')} className="px-8 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-white transition-all">Save Draft</button>
                <button onClick={() => finalizeQuotation('Sent')} className="px-12 py-4 bg-[#ff6b3d] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#ff6b3d]/20 hover:scale-105 active:scale-95 transition-all">Authorize Proposal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationView;