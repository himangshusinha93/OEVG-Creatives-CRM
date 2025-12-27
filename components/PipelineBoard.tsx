import React, { useState } from 'react';
import { Project, ProjectStatus, Client } from '../types';
import { Calendar, DollarSign, ArrowRight, ArrowLeft, Search, Filter, SortAsc } from 'lucide-react';

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
    ProjectStatus.DELIVERED,
    ProjectStatus.CLOSED
];

const StatusColumn: React.FC<StatusColumnProps> = ({ status, projects, onMove }) => {
  const getStatusColor = (s: ProjectStatus) => {
    switch (s) {
      case ProjectStatus.INQUIRY: return 'bg-slate-100 text-slate-600 border-slate-200';
      case ProjectStatus.QUOTED: return 'bg-blue-50 text-blue-600 border-blue-200';
      case ProjectStatus.CONFIRMED: return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case ProjectStatus.SCHEDULED: return 'bg-violet-50 text-violet-600 border-violet-200';
      case ProjectStatus.SHOT: return 'bg-amber-50 text-amber-600 border-amber-200';
      case ProjectStatus.POST_PRODUCTION: return 'bg-rose-50 text-rose-600 border-rose-200';
      case ProjectStatus.DELIVERED: return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case ProjectStatus.CLOSED: return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="min-w-[300px] flex flex-col bg-slate-50/50 rounded-xl h-full p-2 border border-slate-100">
      <div className={`mb-3 px-3 py-2 rounded-lg border text-sm font-semibold flex justify-between items-center ${getStatusColor(status)}`}>
        <span>{status}</span>
        <span className="bg-white/50 px-2 py-0.5 rounded text-xs">{projects.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{project.type}</span>
              <span className="text-xs text-slate-400">#{project.id}</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{project.title}</h4>
            <p className="text-sm text-slate-500 mb-3">{project.clientName}</p>
            
            <div className="space-y-1.5 border-t border-slate-50 pt-3">
              <div className="flex items-center text-xs text-slate-500">
                <Calendar size={14} className="mr-2 text-slate-400" />
                {project.date}
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <DollarSign size={14} className="mr-2 text-slate-400" />
                ${project.budget.toLocaleString()}
              </div>
            </div>

            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-lg">
                <button 
                    onClick={() => onMove(project.id, 'prev')}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <button 
                    onClick={() => onMove(project.id, 'next')}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowRight size={18} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PipelineBoard: React.FC<{ 
    projects: Project[], 
    onUpdateStatus: (id: string, s: ProjectStatus) => void
}> = ({ projects, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'budget' | 'date'>('date');
  const [filterType, setFilterType] = useState('All');

  const filteredProjects = projects
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => filterType === 'All' || p.type === filterType)
    .sort((a, b) => {
        if (sortBy === 'budget') return b.budget - a.budget;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleMove = (id: string, dir: 'next' | 'prev') => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const currentIndex = ALL_STATUSES.indexOf(project.status);
    const nextIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < ALL_STATUSES.length) {
        onUpdateStatus(id, ALL_STATUSES[nextIndex]);
    }
  };

  const columns = ALL_STATUSES.filter(s => s !== ProjectStatus.CLOSED);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex-1 max-w-sm">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search pipeline..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-0"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Photography">Photography</option>
              <option value="Videography">Videography</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <SortAsc size={18} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-0"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date">Date Newest</option>
              <option value="budget">Highest Budget</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-18rem)] flex overflow-x-auto gap-4 pb-4 custom-scrollbar">
        {columns.map(status => (
          <StatusColumn 
            key={status} 
            status={status} 
            projects={filteredProjects.filter(p => p.status === status)} 
            onMove={handleMove}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineBoard;