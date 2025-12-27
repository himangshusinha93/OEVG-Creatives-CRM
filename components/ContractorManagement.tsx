import React, { useState } from 'react';
import { UserPlus, Search, Mail, Star, CheckCircle, Plane, Camera, Monitor, MapPin, X, Palette, UserCheck, Briefcase, ChevronDown, Sparkles, Clock } from 'lucide-react';
import { Freelancer } from '../types';
import VariantPanel from './VariantPanel';

interface ContractorManagementProps {
  contractors: Freelancer[];
  onAddContractor: (f: Freelancer) => void;
  onUpdateRating: (id: string, rating: number) => void;
  onUpdateContractorOptions?: (id: string, options: Partial<Freelancer>) => void;
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

const ContractorManagement: React.FC<ContractorManagementProps> = ({ contractors, onAddContractor, onUpdateRating, onUpdateContractorOptions }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [newContractor, setNewContractor] = useState({ name: '', role: 'Photographer' as any, level: 'Mid' as any, rate: 0 });

  const selectedFreelancer = contractors.find(f => f.id === selectedFreelancerId);

  const roles = ['All', 'Photographer', 'Cinematographer', 'Editor', 'Drone Pilot', 'Designer', 'Influencer'];
  
  const filtered = contractors.filter(f => {
    const matchesRole = filter === 'All' || f.role === filter;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'On Shoot': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Vacation': return 'bg-white/5 text-slate-500 border-white/10';
      default: return 'bg-white/5';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Photographer': return <Camera size={14} />;
      case 'Cinematographer': return <Camera size={14} />;
      case 'Editor': return <Monitor size={14} />;
      case 'Drone Pilot': return <Plane size={14} />;
      case 'Designer': return <Palette size={14} />;
      case 'Influencer': return <UserCheck size={14} />;
      default: return <Camera size={14} />;
    }
  };

  const submitAdd = () => {
    onAddContractor({
        id: `FR-${Math.floor(Math.random()*900)+100}`,
        name: newContractor.name,
        role: newContractor.role,
        level: newContractor.level,
        ratePerDay: Number(newContractor.rate),
        rating: 5.0,
        status: 'Available',
        verified: true,
        variants: [],
        suitableCategories: []
    });
    setIsModalOpen(false);
  };

  const handleToggleCategory = (cat: string) => {
    if (!selectedFreelancer || !onUpdateContractorOptions) return;
    const current = selectedFreelancer.suitableCategories || [];
    const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    onUpdateContractorOptions(selectedFreelancer.id, { suitableCategories: updated });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Freelancer Pool</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Specialist Network • Talent Protocol</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 w-full max-w-sm shadow-inner group focus-within:border-cyan-500/50 transition-all">
            <Search size={18} className="text-slate-600 group-focus-within:text-cyan-400" />
            <input 
              type="text" 
              placeholder="Query talent archive..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black text-white placeholder:text-slate-700 uppercase tracking-tight"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#ff6b3d] to-orange-600 hover:scale-105 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#ff6b3d]/20 active:scale-95 italic"
          >
            <UserPlus size={18} /> Add Specialist
          </button>
        </div>
      </div>

      <div className="flex bg-[#151c2c] p-1.5 border border-white/5 rounded-2xl w-fit shadow-xl overflow-x-auto custom-scrollbar">
        {roles.map(r => (
          <button 
            key={r}
            onClick={() => setFilter(r)}
            className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${filter === r ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(f => (
          <div 
            key={f.id} 
            onClick={() => setSelectedFreelancerId(f.id)}
            className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all group relative cursor-pointer overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="relative">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-cyan-400 font-black text-2xl group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500 shadow-inner border border-white/5">
                  {f.name.charAt(0)}
                </div>
                {f.verified && (
                  <div className="absolute -top-1 -right-1 bg-cyan-600 rounded-full p-1 shadow-lg text-white border-2 border-[#151c2c]">
                    <CheckCircle size={14} />
                  </div>
                )}
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusBadge(f.status)}`}>
                {f.status}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-black text-white tracking-tight uppercase italic group-hover:text-cyan-400 transition-colors">{f.name}</h3>
              <div className="flex items-center text-slate-500 text-[10px] font-black mt-2 mb-8 uppercase tracking-[0.2em]">
                <span className="flex items-center mr-4">
                  {getRoleIcon(f.role)}
                  <span className="ml-2">{f.role}</span>
                </span>
                <span className="flex items-center text-cyan-500/50">
                  <MapPin size={10} className="mr-1.5" /> REM
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Yield Rate</p>
                  <p className="text-white font-black text-lg italic tracking-tighter">₹{f.ratePerDay.toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Tier</p>
                  <p className="text-cyan-400 font-black text-lg uppercase italic tracking-tighter">{f.level}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <div 
                      key={star} 
                      className={`transition-all ${star <= f.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-800'}`}
                    >
                      <Star size={14} />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Score: {f.rating}</span>
              </div>
            </div>
            
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-all`}></div>
          </div>
        ))}
      </div>

      {/* Specialist Profile Modal */}
      {selectedFreelancer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10 animate-in fade-in duration-300">
          <div className="glass-card rounded-[4rem] w-full max-w-[1200px] max-h-full shadow-2xl overflow-hidden border border-white/10 flex flex-col animate-in zoom-in duration-300">
            <div className="p-10 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5 shrink-0">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-cyan-500/20">
                  {selectedFreelancer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{selectedFreelancer.name}</h3>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedFreelancer.role}</span>
                    <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">• {selectedFreelancer.level} Authority</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFreelancerId(null)} className="p-3 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white border border-transparent hover:border-white/10">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-12 overflow-y-auto custom-scrollbar flex-1 space-y-12 bg-[#0b0e14]/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Specialist Summary Sidebar (Left) */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white/[0.03] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4 italic">Specialist Blueprint</h4>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Standard Day Yield</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter">₹{selectedFreelancer.ratePerDay.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Verified Experience</p>
                        <p className="text-xl font-black text-cyan-400 uppercase italic tracking-tight">{selectedFreelancer.level} Command</p>
                      </div>
                      <div className="pt-6 flex gap-4">
                         <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20"><CheckCircle size={24} /></div>
                         <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20"><Briefcase size={24} /></div>
                         <div className="p-4 bg-magenta-500/10 text-magenta-400 rounded-2xl border border-magenta-500/20"><Star size={24} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Categories Panel */}
                  <section className="bg-white/[0.03] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/5">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Operational Clusters</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Defined production scenarios</p>
                    </div>
                    <div className="p-8 max-h-80 overflow-y-auto custom-scrollbar">
                      <div className="space-y-3">
                        {CATEGORY_SCENARIOS.map((cat) => (
                           <label key={cat} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all">
                              <input 
                                type="checkbox" 
                                checked={selectedFreelancer.suitableCategories?.includes(cat) || false}
                                onChange={() => handleToggleCategory(cat)}
                                className="w-5 h-5 border-2 border-slate-700 bg-transparent text-cyan-600 rounded focus:ring-0 cursor-pointer checked:border-cyan-500"
                              />
                              <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${selectedFreelancer.suitableCategories?.includes(cat) ? 'text-white' : 'text-slate-500'}`}>
                                {cat}
                              </span>
                           </label>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Main Content Area (Right) */}
                <div className="lg:col-span-8 space-y-12">
                   <VariantPanel 
                      variants={selectedFreelancer.variants || []} 
                      onEdit={() => console.log('Editing pricing for', selectedFreelancer.id)}
                   />
                   
                   <div className="bg-white/[0.03] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4 flex justify-between items-center italic">
                        Active Deployment Log <ChevronDown size={14} className="text-slate-600" />
                      </h4>
                      <div className="space-y-4 text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                           {/* Fixed missing import for Clock */}
                           <Clock size={28} className="text-slate-700" />
                        </div>
                        <p className="text-[11px] text-slate-600 italic font-black uppercase tracking-[0.3em]">No Active Engagements Detected</p>
                      </div>
                   </div>

                   <div className="bg-gradient-to-tr from-cyan-600 to-blue-700 text-white p-12 rounded-[3.5rem] shadow-2xl shadow-cyan-900/20 relative overflow-hidden group">
                      <div className="relative z-10">
                        <h4 className="text-2xl font-black uppercase italic mb-3 tracking-tighter">Availability Protocol</h4>
                        <p className="text-sm opacity-80 font-bold uppercase tracking-widest max-w-md">Authorized for high-velocity Q4 productions and elite tier deployment.</p>
                      </div>
                      <Sparkles className="absolute top-1/2 -right-8 -translate-y-1/2 w-48 h-48 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                   </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#0a0c1a] border-t border-white/5 flex justify-end gap-6 shrink-0">
               <button onClick={() => setSelectedFreelancerId(null)} className="px-10 py-4 bg-white/5 text-slate-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Export Dossier</button>
               <button className="px-14 py-4 bg-gradient-to-tr from-[#ff6b3d] to-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#ff6b3d]/20 hover:scale-105 transition-all active:scale-95 italic">Initialize Booking Protocol</button>
            </div>
          </div>
        </div>
      )}

      {/* Recruitment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in duration-300">
                <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Onboard Specialist</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-cyan-400 transition-colors"><X size={24} /></button>
                </div>
                <div className="p-10 space-y-6 bg-slate-900/40">
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Legal Identity</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-700"
                            placeholder="e.g. Stephen Spielberg"
                            onChange={e => setNewContractor({...newContractor, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Core Cluster</label>
                        <select 
                            className="w-full bg-[#1a2235] border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                            onChange={e => setNewContractor({...newContractor, role: e.target.value as any})}
                        >
                            {roles.filter(r => r !== 'All').map(r => <option key={r} value={r} className="bg-[#1a2235]">{r}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Tier Level</label>
                            <select 
                                className="w-full bg-[#1a2235] border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                                onChange={e => setNewContractor({...newContractor, level: e.target.value as any})}
                            >
                                <option value="Junior" className="bg-[#1a2235]">Junior</option>
                                <option value="Mid" className="bg-[#1a2235]">Mid-Tier</option>
                                <option value="Senior" className="bg-[#1a2235]">Senior Authority</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Day Yield (₹)</label>
                            <input 
                                type="number" 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white"
                                onChange={e => setNewContractor({...newContractor, rate: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={submitAdd}
                        className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-6 rounded-[1.5rem] font-black uppercase mt-4 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all text-xs tracking-widest italic"
                    >
                        Execute Onboarding
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ContractorManagement;