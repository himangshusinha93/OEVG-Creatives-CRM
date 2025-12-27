import React, { useState } from 'react';
import { Project, Client, Invoice, CoreService, ProjectStatus, ClientType } from '../types';
import { 
  Briefcase, User, FileText, Activity, Users, Plus, X, ArrowRight, 
  CheckCircle2, Clock, Calendar, MapPin, DollarSign, Shield, Phone, 
  Mail, Tag, Box, LayoutGrid, Info, HardDrive, FileSignature, 
  AlertCircle, ChevronRight, Hash, UserCircle, Edit2, Trash2, Save
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  clients: Client[];
  invoices: Invoice[];
  contractors: any[];
  onAddProject: (p: Project) => void;
  onEditProject?: (p: Project) => void;
  onDeleteProject?: (id: string) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, clients, invoices, contractors, onAddProject, onEditProject, onDeleteProject }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newProjectForm, setNewProjectForm] = useState<Partial<Project>>({
    title: '',
    clientId: '',
    category: 'Wedding',
    tier: 'Standard',
    type: CoreService.PHOTOGRAPHY,
    shootType: 'Single-day',
    timeSlot: 'Full-Day',
    budget: 0
  });

  const getClientForProject = (clientId: string) => clients.find(c => c.id === clientId);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.SHOT: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case ProjectStatus.DELIVERED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case ProjectStatus.CLOSED: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      case ProjectStatus.CANCELLED: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setNewProjectForm({
      title: '',
      clientId: '',
      category: 'Wedding',
      tier: 'Standard',
      type: CoreService.PHOTOGRAPHY,
      shootType: 'Single-day',
      timeSlot: 'Full-Day',
      budget: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, p: Project) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewProjectForm({ ...p });
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const submitForm = () => {
    const client = getClientForProject(newProjectForm.clientId || '');
    const now = new Date().toISOString().split('T')[0];
    
    if (isEditing && onEditProject) {
      onEditProject({
        ...newProjectForm as Project,
        clientName: client?.name || newProjectForm.clientName || 'Unknown',
        lastModifiedBy: 'System Admin',
        lastModifiedDate: now
      });
    } else {
      const project: Project = {
        id: `PRJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 999)}`,
        title: newProjectForm.title || 'Untitled Project',
        status: ProjectStatus.INQUIRY,
        creationDate: now,
        projectOwner: 'System Admin',
        
        clientId: newProjectForm.clientId || '',
        clientName: client?.name || 'Unknown',
        clientType: client?.type || ClientType.INDIVIDUAL,
        primaryContact: client?.name || '',
        phone: client?.phone || '',
        email: client?.email || '',
        location: client?.address || '',

        category: (newProjectForm.category as any) || 'Wedding',
        tier: (newProjectForm.tier as any) || 'Standard',
        type: newProjectForm.type || CoreService.PHOTOGRAPHY,
        
        shootType: (newProjectForm.shootType as any) || 'Single-day',
        shootDates: [now],
        timeSlot: (newProjectForm.timeSlot as any) || 'Full-Day',
        deliveryDeadline: now,
        eventLocations: client?.address || '',

        servicesIncluded: 'Basic Package',
        budget: Number(newProjectForm.budget) || 0,
        pipelineStage: ProjectStatus.INQUIRY,
        
        crewAssigned: false,
        equipmentAssigned: false,
        freelancersInvolved: false,
        
        invoiceStatus: 'Not Created',
        paymentStatus: 'Unpaid',
        advanceReceived: false,
        outstandingAmount: Number(newProjectForm.budget) || 0,
        
        createdBy: 'System Admin',
        lastModifiedBy: 'System Admin',
        lastModifiedDate: now,
        
        date: now,
        progress: 0
      };
      onAddProject(project);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId && onDeleteProject) {
      onDeleteProject(deleteId);
      setDeleteId(null);
    }
  };

  const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-white/5 rounded-xl text-cyan-400 border border-white/5">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-widest">{title}</h4>
        {subtitle && <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );

  const InfoBlock = ({ label, value, icon: Icon, accentColor }: { label: string, value: string | number | undefined, icon?: any, accentColor?: string }) => (
    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon size={10} />} {label}
      </p>
      <p className={`text-xs font-bold ${accentColor || 'text-white'} truncate`}>{value || '—'}</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Project Vault</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Universal Source of Truth • Active Deliverables</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-gradient-to-tr from-[#ff6b3d] to-orange-600 text-white px-10 py-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ff6b3d]/20 transition-all hover:scale-105 active:scale-95 italic"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => handleOpenEdit(e, project)}
                  className="flex items-center gap-0 hover:gap-2 px-2 py-1.5 bg-white/5 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg transition-all overflow-hidden max-w-[32px] hover:max-w-[100px] border border-transparent hover:border-cyan-500/20"
                >
                  <Edit2 size={14} className="shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">Edit</span>
                </button>
                <button 
                  onClick={(e) => handleDelete(e, project.id)}
                  className="flex items-center gap-0 hover:gap-2 px-2 py-1.5 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all overflow-hidden max-w-[32px] hover:max-w-[100px] border border-transparent hover:border-rose-500/20"
                >
                  <Trash2 size={14} className="shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity">Delete</span>
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight truncate leading-tight">
              {project.title}
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight mb-6">{project.clientName}</p>
            
            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                <Calendar size={14} className="text-slate-600" />
                {project.shootDates?.[0] || project.date}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                <MapPin size={14} className="text-slate-600" />
                {project.location || 'Location TBD'}
              </div>
              <div className="flex items-center gap-3 text-xs font-black text-cyan-400 pt-2 italic">
                <DollarSign size={16} />
                ₹{project.budget.toLocaleString()}
              </div>
            </div>

            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-all`}></div>
          </div>
        ))}
      </div>

      {/* Project Card Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10 animate-in fade-in">
          <div className="glass-card rounded-[4rem] w-full max-w-[1400px] max-h-full shadow-2xl overflow-hidden border border-white/10 flex flex-col animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-10 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5 shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-cyan-500/20">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">{selectedProject.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-lg border border-cyan-400/20">{selectedProject.id}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">• Project Vault Protocol</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button className="px-8 py-3 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:text-white transition-all">Export Protocol Report</button>
                <button onClick={() => setSelectedProject(null)} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-full transition-all text-slate-500">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable Grid */}
            <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar bg-[#0b0e14]/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* 1. Identity & Context + 3. Classification (LEFT) */}
                <div className="lg:col-span-4 space-y-12">
                  <div className="space-y-6">
                    <SectionTitle icon={Info} title="Project Identity" subtitle="Contextual Core Data" />
                    <div className="grid grid-cols-1 gap-4">
                      <InfoBlock label="Project Status" value={selectedProject.status} accentColor={getStatusColor(selectedProject.status).split(' ')[0]} />
                      <InfoBlock label="Creation Date" value={selectedProject.creationDate} icon={Calendar} />
                      <InfoBlock label="Project Owner" value={selectedProject.projectOwner} icon={UserCircle} />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <SectionTitle icon={Tag} title="Classification" subtitle="Pricing & Logic Universe" />
                    <div className="grid grid-cols-2 gap-4">
                      <InfoBlock label="Category" value={selectedProject.category} />
                      <InfoBlock label="Tier" value={selectedProject.tier} accentColor="text-orange-400" />
                      <InfoBlock label="Nature" value={selectedProject.type} />
                      <InfoBlock label="Package" value={selectedProject.selectedPackage || 'Custom Scoped'} />
                      <div className="col-span-2">
                        <InfoBlock label="Starting Price" value={`₹${(selectedProject.startingPrice || 0).toLocaleString()}`} accentColor="text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Client Info + 4. Timeline (CENTER) */}
                <div className="lg:col-span-4 space-y-12 border-x border-white/5 px-12">
                   <div className="space-y-6">
                    <SectionTitle icon={User} title="Client Information" subtitle="Engagement Entity" />
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                        <p className="text-[11px] font-black text-white italic">{selectedProject.clientName}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedProject.clientType}</p>
                      </div>
                      <InfoBlock label="Primary Contact" value={selectedProject.primaryContact} icon={User} />
                      <div className="grid grid-cols-2 gap-3">
                        <InfoBlock label="Phone" value={selectedProject.phone} icon={Phone} />
                        <InfoBlock label="Email" value={selectedProject.email} icon={Mail} />
                      </div>
                      <InfoBlock label="City/Location" value={selectedProject.location} icon={MapPin} />
                      <InfoBlock label="Ref Source" value={selectedProject.referenceSource} icon={Box} />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <SectionTitle icon={Clock} title="Timeline & Schedule" subtitle="Operational Window" />
                    <div className="grid grid-cols-1 gap-4">
                      <InfoBlock label="Shoot Type" value={selectedProject.shootType} />
                      <InfoBlock label="Shoot Date(s)" value={selectedProject.shootDates?.join(' • ') || selectedProject.date} icon={Calendar} />
                      <InfoBlock label="Time Slot" value={selectedProject.timeSlot} />
                      <InfoBlock label="Delivery Deadline" value={selectedProject.deliveryDeadline} accentColor="text-rose-400" />
                      <InfoBlock label="Event Location(s)" value={selectedProject.eventLocations} icon={MapPin} />
                    </div>
                  </div>
                </div>

                {/* 5. Scope + 6. Quotation + 7. Pipeline (RIGHT) */}
                <div className="lg:col-span-4 space-y-12">
                  <div className="space-y-6">
                    <SectionTitle icon={LayoutGrid} title="Scope Overview" subtitle="Production intent" />
                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Services Summary</p>
                        <p className="text-xs text-white leading-relaxed">{selectedProject.servicesIncluded}</p>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Constraints / Notes</p>
                        <p className="text-xs text-slate-400 italic">{selectedProject.constraints || 'No specified constraints.'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <SectionTitle icon={FileSignature} title="Quotation & Pipeline" subtitle="Commercial & Exec State" />
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl">
                        <div>
                          <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Final Quotation Value</p>
                          <p className="text-xl font-black text-white italic tracking-tighter">₹{selectedProject.budget.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Quotation ID</p>
                          <p className="text-[10px] font-bold text-white">{selectedProject.quotationId || 'QT-PENDING'}</p>
                        </div>
                      </div>
                      <InfoBlock label="Current Pipeline Stage" value={selectedProject.pipelineStage} accentColor="text-orange-400" />
                      <InfoBlock label="Next Action" value={selectedProject.nextActionRequired} icon={ArrowRight} />
                      <InfoBlock label="Responsible Lead" value={selectedProject.responsibleRole} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Multi-Panel Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pt-12 border-t border-white/5">
                 {/* Resource Snapshot */}
                 <div className="space-y-6">
                   <SectionTitle icon={Users} title="Resources" />
                   <div className="space-y-3">
                      {[
                        { label: 'Crew Assigned', active: selectedProject.crewAssigned },
                        { label: 'Equipment Assigned', active: selectedProject.equipmentAssigned },
                        { label: 'Freelancers Involved', active: selectedProject.freelancersInvolved },
                      ].map(res => (
                        <div key={res.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{res.label}</span>
                          {res.active ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-slate-600" />}
                        </div>
                      ))}
                   </div>
                 </div>

                 {/* Financials */}
                 <div className="space-y-6">
                   <SectionTitle icon={DollarSign} title="Financial Health" />
                   <div className="grid grid-cols-1 gap-3">
                      <InfoBlock label="Payment Status" value={selectedProject.paymentStatus} accentColor={selectedProject.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'} />
                      <InfoBlock label="Outstanding" value={`₹${selectedProject.outstandingAmount.toLocaleString()}`} accentColor="text-rose-400" />
                   </div>
                 </div>

                 {/* Communication Notes */}
                 <div className="space-y-6 col-span-2">
                   <SectionTitle icon={Mail} title="Communication & Audit" />
                   <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Internal Archival Notes</p>
                          <p className="text-[11px] text-slate-300 italic">{selectedProject.internalNotes || 'No notes archived.'}</p>
                        </div>
                        <div className="text-[9px] space-y-2 border-l border-white/5 pl-8">
                          <p className="flex justify-between font-bold"><span className="text-slate-500 uppercase">Created By:</span> <span className="text-white">{selectedProject.createdBy}</span></p>
                          <p className="flex justify-between font-bold"><span className="text-slate-500 uppercase">Last Modified:</span> <span className="text-white">{selectedProject.lastModifiedDate}</span></p>
                        </div>
                      </div>
                   </div>
                 </div>
              </div>

              {/* Attachments */}
              <div className="flex flex-wrap gap-4">
                <a href={selectedProject.contractLink} target="_blank" className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition-all">
                  <FileSignature size={18} /> Contract Agreement
                </a>
                <a href={selectedProject.driveLink} target="_blank" className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition-all">
                  <HardDrive size={18} /> Shared Drive Assets
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-[#0a0c1a] border-t border-white/5 flex justify-end gap-6 shrink-0">
               <button 
                onClick={(e) => { handleOpenEdit(e, selectedProject); setSelectedProject(null); }}
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all italic"
               >
                Edit Protocol Card
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Initialize / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in duration-300">
            <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tight italic">{isEditing ? 'Modify Project' : 'Add Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-cyan-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-6 bg-slate-900/40">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Operation Label</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-700 transition-all"
                  placeholder="e.g. Autumn Fashion Shoot"
                  value={newProjectForm.title}
                  onChange={e => setNewProjectForm({...newProjectForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Entity Recipient</label>
                <select 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                  value={newProjectForm.clientId}
                  onChange={e => setNewProjectForm({...newProjectForm, clientId: e.target.value})}
                >
                  <option value="" className="bg-slate-900">Select Target...</option>
                  {clients.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Initial Valuation (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white transition-all"
                    value={newProjectForm.budget}
                    onChange={e => setNewProjectForm({...newProjectForm, budget: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nature</label>
                  <select 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none"
                    value={newProjectForm.type}
                    onChange={e => setNewProjectForm({...newProjectForm, type: e.target.value as any})}
                  >
                    <option value={CoreService.PHOTOGRAPHY} className="bg-slate-900">Photography</option>
                    <option value={CoreService.VIDEOGRAPHY} className="bg-slate-900">Videography</option>
                    <option value={CoreService.HYBRID} className="bg-slate-900">Hybrid</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={submitForm}
                className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase mt-4 shadow-xl shadow-cyan-500/10 active:scale-95 transition-all text-[11px] tracking-[0.2em] italic flex items-center justify-center gap-3"
              >
                {isEditing ? <Save size={18} /> : <Plus size={18} />}
                {isEditing ? 'Commit Changes' : 'Execute Initialization'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="glass-card rounded-[3rem] w-full max-w-md p-10 border border-white/10 shadow-2xl text-center space-y-8 animate-in zoom-in">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-500/5">
              <AlertCircle size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Purge Archive</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
                You are about to permanently delete this project record. This action is irreversible within current protocol.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all border border-white/5"
              >
                Abort
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;