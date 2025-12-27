import React, { useState } from 'react';
import { Project, ProjectStatus, Client } from '../types';
import { Calendar, DollarSign, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';

interface StatusColumnProps {
  status: ProjectStatus;
  projects: Project[];
  onMove: (id: string, dir: 'next' | 'prev') => void;
}

const ALL_STATUSES = [
    ProjectStatus.INQUIRY,
    ProjectStatus.QUOTED,
    ProjectStatus.CONFIRMED,
    ProjectStatus.SCHEDULED,
    ProjectStatus.SHOT,
    ProjectStatus.POST_PRODUCTION,
    ProjectStatus.RAW_DELIVERY,
    ProjectStatus.FINAL_DELIVERY,
    ProjectStatus.DELIVERED,
    ProjectStatus.CLOSED
];

const StatusColumn: React.FC<StatusColumnProps> = ({ status, projects, onMove }) => {
  const getStatusColor = (s: ProjectStatus) => {
    switch (s) {
      case ProjectStatus.INQUIRY: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case ProjectStatus.QUOTED: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case ProjectStatus.CONFIRMED: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case ProjectStatus.SCHEDULED: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case ProjectStatus.SHOT: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case ProjectStatus.POST_PRODUCTION: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case ProjectStatus.RAW_DELIVERY: return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case ProjectStatus.FINAL_DELIVERY: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case ProjectStatus.DELIVERED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ProjectStatus.CLOSED: return 'bg-white/5 text-slate-500 border-white/5';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="min-w-[320px] flex flex-col bg-white/5 rounded-3xl h-full p-3 border border-white/5">
      <div className={`mb-4 px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex justify-between items-center italic ${getStatusColor(status)}`}>
        <span>{status}</span>
        <span className="bg-white/10 px-2.5 py-0.5 rounded-lg text-[10px]">{projects.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar">
        {projects.map(project => (
          <div key={project.id} className="glass-card p-5 rounded-3xl shadow-xl border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{project.type}</span>
              <span className="text-[9px] font-mono text-slate-600">#{project.id}</span>
            </div>
            <h4 className="font-black text-white mb-1 group-hover:text-cyan-400 transition-colors tracking-tight italic">{project.title}</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight mb-4">{project.clientName}</p>
            
            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Calendar size={14} className="mr-2 text-slate-600" />
                {project.date}
              </div>
              <div className="flex items-center text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                <DollarSign size={14} className="mr-2 text-cyan-600" />
                ${project.budget.toLocaleString()}
              </div>
            </div>

            <div className="absolute inset-0 bg-[#0a0c1a]/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6 rounded-3xl">
                <button 
                    onClick={() => onMove(project.id, 'prev')}
                    className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/5"
                >
                    <ArrowLeft size={20} />
                </button>
                <button 
                    onClick={() => onMove(project.id, 'next')}
                    className="p-3 bg-cyan-600 text-white hover:bg-cyan-500 rounded-full transition-all shadow-lg shadow-cyan-500/20"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] italic opacity-50">Empty Queue</div>
        )}
      </div>
    </div>
  );
};

const ProjectBoard: React.FC<{ 
    projects: Project[], 
    onUpdateStatus: (id: string, s: ProjectStatus) => void,
    onAddProject: (p: Project) => void,
    clients: Client[]
}> = ({ projects, onUpdateStatus, onAddProject, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', clientId: '', budget: 0, type: 'Photography' as any });

  const columns = ALL_STATUSES.filter(s => s !== ProjectStatus.CLOSED);

  const handleMove = (id: string, dir: 'next' | 'prev') => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const currentIndex = ALL_STATUSES.indexOf(project.status);
    const nextIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < ALL_STATUSES.length) {
        onUpdateStatus(id, ALL_STATUSES[nextIndex]);
    }
  };

  const submitAdd = () => {
    const client = clients.find(c => c.id === newProject.clientId);
    onAddProject({
        id: (Math.floor(Math.random() * 900) + 100).toString(),
        title: newProject.title,
        clientId: newProject.clientId,
        clientName: client?.name || 'Unknown Client',
        status: ProjectStatus.INQUIRY,
        date: new Date().toISOString().split('T')[0],
        budget: Number(newProject.budget),
        type: newProject.type
    });
    setIsModalOpen(false);
  };

  return (
    <div className="relative animate-fade-in">
      <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Pipeline</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Operational Flow & Project Handover</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 active:scale-95 italic"
          >
              <Plus size={18} />
              New Deployment
          </button>
      </div>

      <div className="h-[calc(100vh-18rem)] flex overflow-x-auto gap-6 pb-6 custom-scrollbar scroll-smooth">
        {columns.map(status => (
          <StatusColumn 
            key={status} 
            status={status} 
            projects={projects.filter(p => p.status === status)} 
            onMove={handleMove}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border-white/10 animate-in zoom-in duration-300">
                <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Initialize Project Card</h3>
                    <button onClick={() => setIsModalOpen(false)} className="hover:text-cyan-400 transition-colors"><X size={24} /></button>
                </div>
                <div className="p-10 space-y-6 bg-slate-900/40">
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Operation Label</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-700 transition-all"
                            placeholder="e.g. Autumn Fashion Shoot"
                            onChange={e => setNewProject({...newProject, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Entity Recipient</label>
                        <select 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                            onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                        >
                            <option value="" className="bg-slate-900">Select Target...</option>
                            {clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Archive Budget ($)</label>
                            <input 
                                type="number" 
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white transition-all"
                                onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Modality</label>
                            <select 
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                                onChange={e => setNewProject({...newProject, type: e.target.value as any})}
                            >
                                <option value="Photography" className="bg-slate-900">Photography</option>
                                <option value="Videography" className="bg-slate-900">Videography</option>
                                <option value="Hybrid" className="bg-slate-900">Hybrid</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={submitAdd}
                        className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase mt-4 shadow-xl shadow-cyan-500/10 active:scale-95 transition-all text-[11px] tracking-[0.2em] italic"
                    >
                        Execute Entry
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;