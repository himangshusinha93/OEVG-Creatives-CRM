import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, Briefcase, X } from 'lucide-react';

interface CalendarViewProps {
  projects: Project[];
  onAddProject: (p: Project) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ projects, onAddProject }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', budget: 0, type: 'Photography' as any });

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const today = new Date();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    const d = new Date();
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(d);
  };

  const getDaysArray = () => {
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);

    for (let i = 0; i < startOffset; i++) {
      days.push({ day: null, currentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, currentMonth: true });
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getProjectsForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return projects.filter(p => p.date === dateStr);
  };

  const selectedDayProjects = selectedDate 
    ? projects.filter(p => p.date === `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`)
    : [];

  const handleAddEvent = () => {
    if (!selectedDate) return;
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    onAddProject({
      id: `EV-${Math.floor(Math.random() * 900) + 100}`,
      title: newEvent.title,
      clientId: 'internal',
      clientName: 'Direct Event',
      status: ProjectStatus.CONFIRMED,
      date: dateStr,
      budget: newEvent.budget,
      type: newEvent.type
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-14rem)] animate-fade-in">
      <div className="flex-1 glass-card rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              {monthNames[month]} <span className="text-slate-600 font-medium">{year}</span>
            </h2>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 shadow-inner">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-xl text-slate-500 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleToday} className="px-5 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
                Current
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-xl text-slate-500 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-3 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/10 transition-all hover:scale-105 active:scale-95 italic"
          >
            <Plus size={18} />
            Provision Schedule
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {d}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto custom-scrollbar">
          {getDaysArray().map((item, idx) => {
            const isToday = item.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = selectedDate && item.day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
            const dayProjects = getProjectsForDate(item.day);

            return (
              <div 
                key={idx} 
                onClick={() => item.day && setSelectedDate(new Date(year, month, item.day))}
                className={`min-h-[110px] border-r border-b border-white/5 p-3 transition-all cursor-pointer relative group
                  ${item.day ? 'hover:bg-white/[0.03]' : 'bg-white/[0.01]'}
                  ${isSelected ? 'bg-cyan-500/5' : ''}
                `}
              >
                {item.day && (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-xl transition-all
                        ${isToday ? 'bg-cyan-600 text-white shadow-lg neon-glow-cyan' : 'text-slate-600 group-hover:text-slate-300'}
                      `}>
                        {item.day}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 mt-2 overflow-hidden">
                      {dayProjects.slice(0, 2).map(p => (
                        <div key={p.id} className="text-[8px] font-black px-2 py-1 rounded-lg truncate bg-white/5 border border-white/10 text-slate-300 shadow-sm flex items-center gap-1.5 uppercase">
                          <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${p.type === 'Photography' ? 'text-amber-400 bg-amber-400' : 'text-cyan-400 bg-cyan-400'}`} />
                          {p.title}
                        </div>
                      ))}
                      {dayProjects.length > 2 && (
                        <div className="text-[8px] font-black text-slate-600 px-2 uppercase tracking-widest mt-1">
                          + {dayProjects.length - 2} Additional
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col gap-8 h-full">
        <div className="glass-card rounded-[3rem] border border-white/5 shadow-2xl p-8 flex-1 flex flex-col overflow-hidden bg-white/[0.02]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-cyan-400">
              <CalendarIcon size={20} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] italic">Daily Manifesto</h3>
            </div>
            {selectedDate && (
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            {selectedDayProjects.length > 0 ? (
              selectedDayProjects.map(p => (
                <div key={p.id} className="p-6 rounded-[2rem] border border-white/5 bg-white/5 group hover:border-cyan-500/30 transition-all shadow-lg relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${p.type === 'Photography' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                      {p.type}
                    </span>
                    <span className="text-[10px] font-black text-white italic tracking-tighter">
                      ${p.budget.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mb-4 leading-tight group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight">
                    {p.title}
                  </h4>
                  <div className="space-y-2.5 relative z-10">
                    <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <Briefcase size={14} className="mr-3 text-slate-700" />
                      {p.clientName}
                    </div>
                    <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <Clock size={14} className="mr-3 text-slate-700" />
                      09:00 AM Call Time
                    </div>
                    <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <MapPin size={14} className="mr-3 text-slate-700" />
                      Studio Terminal A
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                    <Briefcase size={80} />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12">
                <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-inner border border-white/5">
                  <Clock size={28} className="text-slate-800" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No Direct Engagements</p>
                <p className="text-[9px] font-bold text-center mt-2 uppercase opacity-50 tracking-widest">Query marked intervals <br/> for schedule access.</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-black/50 hover:bg-cyan-600 transition-all active:scale-95 flex items-center justify-center gap-3 italic"
          >
            <Plus size={18} />
            Log Rapid Session
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl border-white/10 animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Schedule Rapid Capture</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-cyan-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-6 bg-slate-900/40">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Engagement Descriptor</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-700 transition-all"
                  placeholder="e.g. Rapid Equipment Prep"
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Modality</label>
                  <select 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white appearance-none transition-all"
                    onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                  >
                    <option value="Photography" className="bg-slate-900">Photography</option>
                    <option value="Videography" className="bg-slate-900">Videography</option>
                    <option value="Hybrid" className="bg-slate-900">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Archive Cost ($)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white transition-all"
                    onChange={e => setNewEvent({...newEvent, budget: Number(e.target.value)})}
                  />
                </div>
              </div>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] italic text-center">Interval Target: {selectedDate?.toLocaleDateString()}</p>
              <button 
                onClick={handleAddEvent}
                className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase mt-4 shadow-xl shadow-cyan-500/10 active:scale-95 transition-all text-[11px] tracking-[0.2em] italic"
              >
                Execute Commitment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;