import React, { useState } from 'react';
import { Asset, Tab, Freelancer, Client } from '../types';
import { Plus, CheckCircle, AlertCircle, X, Camera, Zap, Mic, Wind, DollarSign, User, ShieldCheck, Clock, Image as ImageIcon, Settings, Info, Trash2 } from 'lucide-react';
import VariantPanel from './VariantPanel';

interface EquipmentViewProps {
  assets: Asset[];
  contractors: Freelancer[];
  clients: Client[];
  onAddAsset: (asset: Asset) => void;
  onUpdateAssetStatus: (id: string) => void;
  onUpdateAssetOptions?: (id: string, options: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
}

const CATEGORY_SCENARIOS = [
  "Celebration Photography",
  "Celebration Videography",
  "Music Videos",
  "Personal Photoshoot",
  "Portfolio Photoshoot",
  "Wedding Photography",
  "Fashion Photoshoot",
  "Event Shoot Projects"
];

const EquipmentView: React.FC<EquipmentViewProps> = ({ assets, contractors, clients, onAddAsset, onUpdateAssetStatus, onUpdateAssetOptions, onDeleteAsset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Camera' as any, cost: 0, rentalRate: 0 });

  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Camera': return <Camera size={20} />;
      case 'Light': return <Zap size={20} />;
      case 'Audio': return <Mic size={20} />;
      case 'Drone': return <Wind size={20} />;
      default: return <Camera size={20} />;
    }
  };

  const submitAdd = () => {
    onAddAsset({
      id: `EQ-${Math.floor(Math.random() * 9000) + 1000}`,
      name: newAsset.name,
      category: newAsset.category,
      status: 'Available',
      cost: Number(newAsset.cost),
      rentalRate: Number(newAsset.rentalRate),
      variants: [],
      projectTypes: [],
      suitableCategories: []
    });
    setIsModalOpen(false);
  };

  const getAssignedName = (assignedId?: string) => {
    if (!assignedId) return 'Unassigned';
    const contractor = contractors.find(c => c.id === assignedId);
    if (contractor) return contractor.name;
    const client = clients.find(c => c.id === assignedId);
    if (client) return client.name;
    return 'Unknown Entity';
  };

  const handleToggleProjectType = (type: 'Photography' | 'Videography' | 'Hybrid') => {
    if (!selectedAsset || !onUpdateAssetOptions) return;
    const current = selectedAsset.projectTypes || [];
    const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    onUpdateAssetOptions(selectedAsset.id, { projectTypes: updated as any });
  };

  const handleToggleCategory = (cat: string) => {
    if (!selectedAsset || !onUpdateAssetOptions) return;
    const current = selectedAsset.suitableCategories || [];
    const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    onUpdateAssetOptions(selectedAsset.id, { suitableCategories: updated });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map(asset => (
          <div 
            key={asset.id} 
            className="glass-card p-6 rounded-[2.5rem] shadow-2xl border-white/5 flex justify-between items-center cursor-pointer hover:border-cyan-500/30 transition-all group overflow-hidden"
          >
            <div onClick={() => setSelectedAssetId(asset.id)} className="flex items-center gap-4 relative z-10 flex-1">
              <div className="p-4 bg-white/5 text-slate-500 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors rounded-2xl border border-white/5">
                {getIcon(asset.category)}
              </div>
              <div>
                <h4 className="font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight italic">{asset.name}</h4>
                <div className="flex items-center text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                  <span>{asset.category}</span>
                  <span className="mx-2">•</span>
                  <span className="text-cyan-400">₹{asset.rentalRate}/day</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 relative z-10">
              <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors
                ${asset.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  asset.status === 'In Use' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {asset.status}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteAsset(asset.id); }}
                className="p-2 text-slate-700 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-cyan-500/5 blur-3xl rounded-full"></div>
          </div>
        ))}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-slate-600 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-white/5 transition-all group shadow-inner"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-cyan-500/20 transition-all">
            <Plus size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Archive Gear</span>
        </button>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="glass-card rounded-[3rem] w-full max-w-5xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border-white/10 animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
            <div className="p-6 bg-[#0a0c1a] border-b border-white/5 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/5 text-cyan-400 rounded-xl border border-white/5">{getIcon(selectedAsset.category)}</div>
                 <div>
                    <h3 className="text-xl font-black text-white italic leading-tight">{selectedAsset.name}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Inventory Protocol • ID: {selectedAsset.id}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedAssetId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-cyan-400"><X size={24} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: General Info & Wix-style Panels */}
                <div className="lg:col-span-8 space-y-8">
                  <section className="glass-card rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Operational Logic</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Configure resource deployment scenarios</p>
                      </div>
                    </div>
                    <div className="divide-y divide-white/5">
                      <div className="px-6 py-8 flex items-start gap-12">
                        <div className="w-24 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Modality</div>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {['Photography', 'Videography', 'Hybrid'].map((type) => (
                            <button 
                              key={type}
                              onClick={() => handleToggleProjectType(type as any)}
                              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                selectedAsset.projectTypes?.includes(type as any) 
                                ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-500/20' 
                                : 'bg-white/5 text-slate-500 border-white/5 hover:border-cyan-500/30'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="px-6 py-8 flex items-start gap-12">
                        <div className="w-24 text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Scenarios</div>
                        <div className="flex-1 text-xs font-bold text-slate-300 tracking-tight leading-relaxed">
                          {selectedAsset.suitableCategories && selectedAsset.suitableCategories.length > 0 
                           ? selectedAsset.suitableCategories.join(' • ')
                           : <span className="text-slate-600 italic font-medium">No archived scenarios selected</span>}
                        </div>
                      </div>
                    </div>
                  </section>
                  <VariantPanel variants={selectedAsset.variants || []} />
                  <section className="glass-card border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 italic border-b border-white/5 pb-4">
                      <ShieldCheck size={16} className="text-cyan-400" /> Operational Checkout & Custody
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-slate-600 flex items-center justify-center shadow-inner">
                          <User size={28} />
                        </div>
                        <div>
                          <p className="text-base font-black text-white italic leading-none">{getAssignedName(selectedAsset.assignedToId)}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{selectedAsset.status === 'In Use' ? 'Active Production' : 'Stationary Stock'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border
                          ${selectedAsset.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {selectedAsset.status}
                        </div>
                        <button 
                          onClick={() => onUpdateAssetStatus(selectedAsset.id)}
                          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/10 transition-all active:scale-95"
                        >
                          Toggle State
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Side Cards */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-gradient-to-tr from-cyan-600 to-blue-700 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">Daily Revenue Yield</p>
                      <p className="text-4xl font-black italic tracking-tighter">₹{selectedAsset.rentalRate.toLocaleString()}</p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-white/10 relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Asset Valuation</p>
                      <p className="text-xl font-bold tracking-tight">₹{selectedAsset.cost.toLocaleString()}</p>
                    </div>
                    <Camera className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 transform rotate-12" />
                  </div>
                  <section className="glass-card rounded-2xl border border-white/5 shadow-2xl flex flex-col h-fit overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/5">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Scenarios</h4>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                      <div className="space-y-1">
                        {CATEGORY_SCENARIOS.map((cat) => (
                           <label key={cat} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
                              <input 
                                type="checkbox" 
                                checked={selectedAsset.suitableCategories?.includes(cat) || false}
                                onChange={() => handleToggleCategory(cat)}
                                className="w-5 h-5 border-2 border-slate-600 bg-transparent rounded text-cyan-600 focus:ring-0 cursor-pointer transition-all checked:border-cyan-500"
                              />
                              <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${selectedAsset.suitableCategories?.includes(cat) ? 'text-cyan-400' : 'text-slate-500'}`}>
                                {cat}
                              </span>
                           </label>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-[#0a0c1a] border-t border-white/5 flex justify-end gap-4 shrink-0 shadow-2xl">
               <button onClick={() => setSelectedAssetId(null)} className="px-8 py-3 text-slate-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Abort</button>
               <button onClick={() => setSelectedAssetId(null)} className="px-12 py-3 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all italic">Commit Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="glass-card rounded-[2.5rem] w-full max-w-md shadow-2xl border-white/10 animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Resource Registration</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-cyan-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Asset Identity</label>
                <input type="text" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white" placeholder="e.g. Sony FX3 Cinema" onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Class</label>
                  <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none" onChange={e => setNewAsset({...newAsset, category: e.target.value as any})}>
                    <option value="Camera">Camera</option>
                    <option value="Lens">Lens</option>
                    <option value="Light">Light</option>
                    <option value="Audio">Audio</option>
                    <option value="Drone">Drone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Archive Value</label>
                  <input type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white" onChange={e => setNewAsset({...newAsset, cost: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Daily Yield (₹)</label>
                <input type="number" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white" onChange={e => setNewAsset({...newAsset, rentalRate: Number(e.target.value)})} />
              </div>
              <button onClick={submitAdd} className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase mt-4 shadow-xl active:scale-95 transition-all text-[11px] tracking-[0.2em] italic">Execute Archival</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentView;