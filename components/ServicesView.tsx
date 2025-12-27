import React, { useState } from 'react';
import { ServiceItem, CoreService, PlanSubItem, User } from '../types';
import { Camera, Film, Scissors, Layers, Plus, Edit2, X, Save, Trash2, LayoutGrid, Package, CheckCircle2, ShoppingCart, AlertTriangle, Info, ExternalLink, Palette, Globe } from 'lucide-react';

interface ServicesViewProps {
  user?: User | null;
  services: ServiceItem[];
  onAddService: (s: ServiceItem) => void;
  onUpdateService?: (s: ServiceItem) => void;
  onDeleteService: (id: string) => void;
  onDeleteCategory?: (pillar: CoreService, category: string) => void;
  onNotify: (text: string) => void;
  onAddToCart?: (items: any[]) => void;
}

const PANEL_THEMES = [
  { name: 'Azure', border: 'border-[#3c9cfd]/30', glow: 'shadow-[#3c9cfd]/5', accent: 'text-[#3c9cfd]', bg: 'bg-[#3c9cfd]/5', solid: '#3c9cfd' },
  { name: 'Orange', border: 'border-[#ff6b3d]/30', glow: 'shadow-[#ff6b3d]/5', accent: 'text-[#ff6b3d]', bg: 'bg-[#ff6b3d]/5', solid: '#ff6b3d' },
  { name: 'Teal', border: 'border-[#00d1ff]/30', glow: 'shadow-[#00d1ff]/5', accent: 'text-[#00d1ff]', bg: 'bg-[#00d1ff]/5', solid: '#00d1ff' },
  { name: 'Coral', border: 'border-[#ff4b6b]/30', glow: 'shadow-[#ff4b6b]/5', accent: 'text-[#ff4b6b]', bg: 'bg-[#ff4b6b]/5', solid: '#ff4b6b' },
];

const ServicesView: React.FC<ServicesViewProps> = ({ user, services, onAddService, onUpdateService, onDeleteService, onDeleteCategory, onNotify, onAddToCart }) => {
  const [activePillar, setActivePillar] = useState<CoreService>(CoreService.PHOTOGRAPHY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete confirmation state for plans
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // Delete confirmation state for categories (services)
  const [deleteCategoryData, setDeleteCategoryData] = useState<{pillar: CoreService, category: string} | null>(null);

  const [newPlan, setNewPlan] = useState<Omit<ServiceItem, 'id'>>({
    pillar: CoreService.PHOTOGRAPHY,
    category: '',
    planName: '',
    price: 0,
    rateType: 'Fixed',
    description: '',
    items: [],
    portfolioLink: '',
    themeIndex: 0
  });

  const [isNewCategory, setIsNewCategory] = useState(false);
  
  // Temporary state for adding a sub-item in the modal
  const [tempItem, setTempItem] = useState({ name: '', price: 0, isMandatory: true });

  const pillarServices = services.filter(s => s.pillar === activePillar);
  const categories: string[] = Array.from(new Set(pillarServices.map(s => s.category)));

  const isAdmin = user?.role === 'Root Admin';

  const handleOpenAdd = (category?: string) => {
    setEditingId(null);
    setNewPlan({
      pillar: activePillar,
      category: category || '',
      planName: '',
      price: 0,
      rateType: 'Fixed',
      description: '',
      items: [],
      portfolioLink: '',
      themeIndex: 0
    });
    setTempItem({ name: '', price: 0, isMandatory: true });
    setIsNewCategory(!category);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setNewPlan({
      pillar: s.pillar,
      category: s.category,
      planName: s.planName,
      price: s.price,
      rateType: s.rateType,
      description: s.description,
      items: s.items || [],
      portfolioLink: s.portfolioLink || '',
      themeIndex: s.themeIndex ?? 0
    });
    setTempItem({ name: '', price: 0, isMandatory: true });
    setIsNewCategory(false);
    setIsModalOpen(true);
  };

  const addSubItem = () => {
    if (!tempItem.name) return;
    const item: PlanSubItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: tempItem.name,
      price: tempItem.price,
      isMandatory: tempItem.isMandatory
    };
    setNewPlan(prev => ({ ...prev, items: [...prev.items, item] }));
    setTempItem({ name: '', price: 0, isMandatory: true });
  };

  const removeSubItem = (id: string) => {
    setNewPlan(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const submitSave = () => {
    if (!newPlan.category || !newPlan.planName) {
      onNotify("Please complete all required fields.");
      return;
    }

    if (editingId) {
      onUpdateService?.({ ...newPlan, id: editingId });
      onNotify("Services blueprint modified.");
    } else {
      onAddService({
        id: `SRV-${Math.floor(Math.random() * 9000) + 1000}`,
        ...newPlan
      });
      onNotify("New services protocol initialized.");
    }
    setIsModalOpen(false);
  };

  const executeDeletion = () => {
    if (deleteId) {
      onDeleteService(deleteId);
      onNotify("Plan record purged from database.");
    }
    setDeleteId(null);
  };

  const executeCategoryDeletion = () => {
    if (deleteCategoryData && onDeleteCategory) {
      onDeleteCategory(deleteCategoryData.pillar, deleteCategoryData.category);
    }
    setDeleteCategoryData(null);
  };

  const handleAddToCartFromService = (plan: ServiceItem) => {
    onNotify(`Selected Plan "${plan.planName}" added to cart.`);
    if (onAddToCart) {
      onAddToCart(plan.items);
    }
  };

  const getPillarIcon = (pillar: CoreService) => {
    switch (pillar) {
      case CoreService.PHOTOGRAPHY: return <Camera size={18} />;
      case CoreService.VIDEOGRAPHY: return <Film size={18} />;
      case CoreService.POST_PRODUCTION: return <Scissors size={18} />;
      case CoreService.HYBRID: return <Layers size={18} />;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight uppercase">Services Architect</h3>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Unified Rate Card & Deployment Configuration</p>
        </div>
        <button 
          onClick={() => handleOpenAdd()}
          className="bg-[#ff6b3d] text-white px-10 py-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ff6b3d]/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      {/* Pillar Navigation */}
      <div className="flex bg-[#151c2c] p-1.5 rounded-2xl border border-white/5 w-fit shadow-xl">
        {(Object.values(CoreService) as CoreService[]).map(pillar => (
          <button
            key={pillar}
            onClick={() => setActivePillar(pillar)}
            className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activePillar === pillar ? 'bg-[#3c9cfd] text-white shadow-lg shadow-[#3c9cfd]/20' : 'text-slate-500 hover:text-white'}`}
          >
            {getPillarIcon(pillar)}
            {pillar}
          </button>
        ))}
      </div>

      {/* Categories & Plans Display */}
      <div className="space-y-16">
        {categories.length > 0 ? categories.map((cat, catIdx) => (
          <div key={cat} className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#151c2c] rounded-2xl flex items-center justify-center text-[#3c9cfd] border border-white/5 shadow-inner">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight uppercase">{cat} Operations</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">Standard Services Configurations</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button 
                    onClick={() => setDeleteCategoryData({pillar: activePillar, category: cat})}
                    className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 flex items-center gap-2 transition-all bg-rose-500/5 px-4 py-2 rounded-xl border border-rose-500/10"
                  >
                    <Trash2 size={16} /> Delete Service Group
                  </button>
                )}
                <button 
                  onClick={() => handleOpenAdd(cat)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#3c9cfd] hover:text-[#00d1ff] flex items-center gap-2 transition-all"
                >
                  <Plus size={16} /> Add Plan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pillarServices.filter(s => s.category === cat).map((service) => {
                const theme = PANEL_THEMES[service.themeIndex ?? 0];
                return (
                  <div key={service.id} className={`glass-card rounded-[2.5rem] border ${theme.border} p-10 shadow-2xl transition-all group flex flex-col relative overflow-hidden h-[560px]`}>
                    <div className="flex justify-between items-start mb-6 relative z-10 shrink-0">
                      <div className={`p-4 ${theme.bg} rounded-2xl ${theme.accent} border border-white/5`}>
                        <Package size={24} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEdit(service)} className="p-2.5 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteId(service.id)} className="p-2.5 text-slate-500 hover:text-rose-500 bg-white/5 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>

                    <div className="flex-1 relative z-10 space-y-4 overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start gap-4 shrink-0">
                        <h5 className={`text-xl font-black text-white uppercase tracking-tight group-hover:${theme.accent} transition-colors leading-tight truncate`}>{service.planName}</h5>
                        {service.portfolioLink && (
                          <a 
                            href={service.portfolioLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border ${theme.border} ${theme.accent} text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shrink-0`}
                          >
                            <Globe size={12} /> Portfolio
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed shrink-0 line-clamp-2">{service.description}</p>
                      
                      <div className="flex-1 flex flex-col space-y-3 pt-4 border-t border-white/5 min-h-0">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">Plan Composition</p>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                          {service.items?.map(item => (
                            <div key={item.id} className="flex items-center justify-between group/item">
                              <div className="flex items-center gap-2">
                                {item.isMandatory ? <CheckCircle2 size={12} className={theme.accent} /> : <Plus size={12} className="text-slate-600" />}
                                <span className={`text-[11px] font-bold ${item.isMandatory ? 'text-slate-200' : 'text-slate-500'} truncate max-w-[120px]`}>{item.name}</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-600">₹{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4 relative z-10 shrink-0">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Starting price</p>
                          <p className="text-2xl font-black text-white tracking-tighter">
                            ₹{service.price.toLocaleString()}
                            <span className="text-[10px] text-slate-500 font-bold ml-1 uppercase">/{service.rateType === 'Fixed' ? 'pr' : 'hr'}</span>
                          </p>
                        </div>
                        <button 
                          onClick={() => handleAddToCartFromService(service)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b3d] text-white transition-all font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#ff6b3d]/20 active:scale-95`}
                        >
                          <ShoppingCart size={14} /> Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${theme.bg} blur-[80px] rounded-full group-hover:opacity-100 opacity-50 transition-all`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        )) : (
          <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600 bg-white/[0.01]">
             <LayoutGrid size={64} className="mb-6 opacity-20" />
             <p className="text-xs font-black uppercase tracking-[0.25em]">No Services Protocols Defined for {activePillar}</p>
             <button onClick={() => handleOpenAdd()} className="mt-8 text-[#3c9cfd] font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-8 transition-all">+ Initialize First Service Category</button>
          </div>
        )}
      </div>

      {/* Main Architect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-[#151c2c] rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
            <div className="p-10 bg-[#1a2235] text-white flex justify-between items-center border-b border-white/5 shrink-0 shadow-lg">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Edit Plan Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-[#ff6b3d] transition-all"><X size={28} /></button>
            </div>
            
            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Type</label>
                  <div className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-slate-400">
                    {activePillar}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Services Category</label>
                  {isNewCategory ? (
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-bold text-white placeholder:text-slate-700"
                      placeholder="e.g. Traditional, Studio..."
                      value={newPlan.category}
                      onChange={e => setNewPlan({...newPlan, category: e.target.value})}
                    />
                  ) : (
                    <div className="relative group">
                      <select 
                        className="w-full bg-[#1a2235] border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-bold text-white appearance-none"
                        value={newPlan.category}
                        onChange={e => {
                          if (e.target.value === 'ADD_NEW') setIsNewCategory(true);
                          else setNewPlan({...newPlan, category: e.target.value});
                        }}
                      >
                        <option value={newPlan.category} className="bg-[#1a2235]">{newPlan.category || 'Select Category'}</option>
                        {categories.filter(c => c !== newPlan.category).map(c => <option key={c} value={c} className="bg-[#1a2235]">{c}</option>)}
                        <option value="ADD_NEW" className="bg-[#1a2235] text-[#3c9cfd] font-black">+ Create New Category</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <Palette size={18} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Name</label>
                    <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-bold text-white placeholder:text-slate-700"
                    placeholder="e.g. Cinema Pro Max..."
                    value={newPlan.planName}
                    onChange={e => setNewPlan({...newPlan, planName: e.target.value})}
                    />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield Protocol</label>
                  <select 
                    className="w-full bg-[#1a2235] border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-bold text-white appearance-none"
                    value={newPlan.rateType}
                    onChange={e => setNewPlan({...newPlan, rateType: e.target.value as any})}
                  >
                    <option value="Fixed" className="bg-[#1a2235]">Fixed Project Fee</option>
                    <option value="Hourly" className="bg-[#1a2235]">Hourly Yield</option>
                    <option value="Day Rate" className="bg-[#1a2235]">Daily Operating Yield</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Starting price (₹)</label>
                  <input 
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-bold text-white"
                      value={newPlan.price}
                      onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portfolio Link (YouTube/Drive)</label>
                  <input 
                      type="url" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-bold text-white placeholder:text-slate-700"
                      placeholder="https://..."
                      value={newPlan.portfolioLink}
                      onChange={e => setNewPlan({...newPlan, portfolioLink: e.target.value})}
                  />
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} className="text-[#3c9cfd]" />
                    Plan Panel Visual Theme
                  </label>
                  <div className="flex gap-4">
                    {PANEL_THEMES.map((theme, idx) => (
                      <button
                        key={idx}
                        onClick={() => setNewPlan({ ...newPlan, themeIndex: idx })}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${newPlan.themeIndex === idx ? 'border-white bg-white/10 scale-105 shadow-xl' : 'border-white/5 bg-white/5 opacity-40 hover:opacity-100'}`}
                      >
                        <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: theme.solid }}></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">{theme.name}</span>
                      </button>
                    ))}
                  </div>
              </div>

              {/* Architecture Components (Sub-items) */}
              <div className="space-y-6 bg-black/20 p-8 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                    <Info size={16} className="text-[#3c9cfd]" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Architecture: Mandatory & Add-On Components</h4>
                </div>
                
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-600"
                            placeholder="Deliverable Name..."
                            value={tempItem.name}
                            onChange={e => setTempItem({...tempItem, name: e.target.value})}
                        />
                    </div>
                    <div className="col-span-3">
                        <input 
                            type="number" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white"
                            placeholder="Price"
                            value={tempItem.price}
                            onChange={e => setTempItem({...tempItem, price: Number(e.target.value)})}
                        />
                    </div>
                    <div className="col-span-3">
                        <select 
                            className="w-full bg-[#1a2235] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white appearance-none"
                            value={tempItem.isMandatory ? 'M' : 'A'}
                            onChange={e => setTempItem({...tempItem, isMandatory: e.target.value === 'M'})}
                        >
                            <option value="M">Mandatory</option>
                            <option value="A">Add-On</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <button 
                            onClick={addSubItem}
                            className="w-full h-full flex items-center justify-center bg-[#ff6b3d] text-white rounded-xl hover:bg-[#ff4b6b] transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 mt-4 max-h-48 overflow-y-auto custom-scrollbar">
                    {newPlan.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group/li">
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${item.isMandatory ? 'bg-[#3c9cfd]/20 text-[#3c9cfd] border border-[#3c9cfd]/30' : 'bg-[#ff6b3d]/20 text-[#ff6b3d] border border-[#ff6b3d]/30'} uppercase tracking-widest`}>
                                    {item.isMandatory ? 'Mandatory' : 'Add-On'}
                                </span>
                                <span className="text-xs font-bold text-white">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-slate-500 tracking-tighter">₹{item.price.toLocaleString()}</span>
                                <button onClick={() => removeSubItem(item.id)} className="text-slate-600 hover:text-rose-500 transition-colors"><X size={14} /></button>
                            </div>
                        </div>
                    ))}
                    {newPlan.items.length === 0 && (
                        <p className="text-[10px] text-center text-slate-600 font-bold uppercase py-4">No components defined for this plan.</p>
                    )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Scope Descriptor</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#3c9cfd] focus:outline-none font-medium text-white h-32 leading-relaxed"
                  placeholder="Summarize production scope..."
                  value={newPlan.description}
                  onChange={e => setNewPlan({...newPlan, description: e.target.value})}
                />
              </div>

              <button 
                onClick={submitSave}
                className="w-full bg-[#ff6b3d] text-white py-6 rounded-2xl font-black uppercase shadow-2xl shadow-[#ff6b3d]/10 active:scale-95 transition-all text-xs tracking-widest flex items-center justify-center gap-4 italic"
              >
                <Save size={20} /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Delete Confirmation Dialog for Plans */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in">
            <div className="glass-card rounded-[3rem] w-full max-w-md p-10 border border-white/10 shadow-2xl text-center space-y-8 animate-in zoom-in">
                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-500/5">
                    <AlertTriangle size={40} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">System Purge Protocol</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
                        You are about to permanently delete this plan configuration. This action is irreversible.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setDeleteId(null)}
                        className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all border border-white/5"
                    >
                        Abort Deletion
                    </button>
                    <button 
                        onClick={executeDeletion}
                        className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                    >
                        Confirm Purge
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Delete Confirmation for Categories (Services) */}
      {deleteCategoryData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in">
            <div className="glass-card rounded-[3rem] w-full max-w-md p-10 border border-white/10 shadow-2xl text-center space-y-8 animate-in zoom-in">
                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-500/5">
                    <Trash2 size={40} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Service Group Purge</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
                        You are about to delete the entire <span className="text-white font-black">{deleteCategoryData.category}</span> service category under {deleteCategoryData.pillar}. This will remove all associated plans.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setDeleteCategoryData(null)}
                        className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all border border-white/5"
                    >
                        Keep Service
                    </button>
                    <button 
                        onClick={executeCategoryDeletion}
                        className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                    >
                        Delete Service
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ServicesView;