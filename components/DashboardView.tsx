import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MoreVertical, ArrowUpRight, ArrowDownRight, Users, Briefcase, DollarSign, Activity, TrendingUp, Calendar, ChevronLeft, ChevronRight, FileCheck, Clock, ClipboardList, Timer } from 'lucide-react';
import { FINANCIAL_DATA } from '../constants';
import { ProjectStatus, Client, Project, Tab } from '../types';

const CYAN = '#00a3ff';
const ORANGE = '#ff6b3d';
const TEAL = '#00d1ff';
const CORAL = '#ff4b6b';
const YELLOW = '#ff9d00';

const AnalyticsTile = ({ title, value, colorClass, icon: Icon }: { title: string, value: string, colorClass: string, icon: any }) => (
  <div className={`glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4 flex-1 shadow-lg`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col">
      <span className="text-slate-400 text-sm font-bold">{title}</span>
      <span className="text-3xl font-black text-white tracking-tight">{value}</span>
    </div>
  </div>
);

const ReportCard = ({ title, value, percentage, color, icon: Icon, trendUp }: { title: string, value: string, percentage: string, color: string, icon: any, trendUp: boolean }) => (
  <div className="flex flex-col bg-[#1a2235]/40 p-6 rounded-2xl border border-white/5 flex-1 min-w-[200px]">
    <div className="flex justify-between items-center mb-6">
      <span className="text-slate-300 font-bold text-sm">{title}</span>
      <button className="text-slate-500"><MoreVertical size={16} /></button>
    </div>
    <div className="flex items-center gap-4 mb-4">
      <div className="flex -space-x-2">
        {[1,2,3].map(i => (
          <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a2235] bg-slate-700 flex items-center justify-center text-[10px] font-bold">
            {i === 3 ? '+4' : <img src={`https://i.pravatar.cc/100?u=${i+title}`} className="rounded-full" />}
          </div>
        ))}
      </div>
    </div>
    <div className="flex items-end justify-between">
      <h4 className="text-2xl font-black text-white">{value}</h4>
      <span className="text-slate-500 font-bold text-sm">{percentage}</span>
    </div>
    <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: percentage, backgroundColor: color }}></div>
    </div>
  </div>
);

const ActivityItem = ({ user, action, project, time, color }: { user: string, action: string, project: string, time: string, color: string }) => (
  <div className={`p-4 rounded-2xl border border-white/5 flex gap-4 transition-all hover:translate-x-1 cursor-pointer`} style={{ backgroundColor: `${color}15` }}>
    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white/10">
      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} alt="avatar" />
    </div>
    <div className="flex flex-col flex-1">
      <p className="text-sm font-bold text-white leading-tight">
        <span style={{ color: color }}>{user}</span> {action}
      </p>
      <p className="text-xs text-slate-400 mt-1">{project}</p>
    </div>
  </div>
);

const DashboardView: React.FC<{ projects: Project[], clients: Client[], onNavigate: (tab: Tab) => void }> = ({ projects, clients, onNavigate }) => {
  const totalRevenue = clients.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const activeProjects = projects.filter(p => p.status !== ProjectStatus.CLOSED && p.status !== ProjectStatus.DELIVERED).length;
  
  const barData = [
    { name: 'Jan', val: 40, active: 20 },
    { name: 'Feb', val: 30, active: 25 },
    { name: 'Mar', val: 20, active: 10 },
    { name: 'Apr', val: 60, active: 30 },
    { name: 'May', val: 70, active: 35 },
    { name: 'Jun', val: 80, active: 40 },
    { name: 'Jul', val: 50, active: 25 },
    { name: 'Aug', val: 45, active: 20 },
    { name: 'Sep', val: 40, active: 15 },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Section: Sales Overview and Mini-Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Sales Report Overview */}
        <div className="lg:col-span-8 glass-card p-10 rounded-[2.5rem] flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Sales Report Overview</h2>
              <p className="text-slate-500 text-sm font-bold mt-1">Total Sales in a Week</p>
            </div>
            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10">View Customize</button>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <ReportCard title="Sales Revenue" value="45K" percentage="57%" color={CYAN} icon={DollarSign} trendUp={true} />
            <ReportCard title="Today Received" value="$254.25" percentage="33%" color={YELLOW} icon={TrendingUp} trendUp={true} />
            <ReportCard title="Sales Total" value="23K" percentage="83%" color={ORANGE} icon={Activity} trendUp={true} />
          </div>
        </div>

        {/* Right: Small Calendar and Top Products */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-[#1a2235] p-6 rounded-[2rem] border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold text-sm">September, 2024</span>
              <div className="flex gap-2">
                <button className="text-slate-500"><ChevronLeft size={16} /></button>
                <button className="text-slate-500"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-[10px] font-black text-slate-500 text-center uppercase">{d}</div>)}
              {[1,2,3,4,5,6,7].map(d => (
                <div key={d} className={`p-2 text-center text-xs font-bold rounded-lg ${d === 6 ? 'bg-[#ff6b3d] text-white shadow-lg' : 'text-slate-400'}`}>
                  {d.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-white/5 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-white font-black text-lg">Top Product</span>
              <button className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10">On Going <MoreVertical size={14} /></button>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Fashion Category', progress: 77, color: ORANGE },
                { label: 'Shoes Category', progress: 22, color: CYAN },
                { label: 'Skincare Category', progress: 40, color: TEAL },
                { label: 'Home Decor', progress: 77, color: YELLOW },
              ].map(p => (
                <div key={p.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-white border-l-4 pl-3" style={{ borderColor: p.color }}>{p.label}</span>
                    <span className="text-slate-400">Progress {p.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Revenue Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Average Revenue Chart */}
        <div className="lg:col-span-4 glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white">Average Revenue</h2>
            <button className="text-slate-400 text-xs font-bold flex items-center gap-2">Today <MoreVertical size={14} /></button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#151c2c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="val" fill="#1a2235" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="#3c9cfd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Working Hours Tile */}
        <div className="lg:col-span-4 glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-slate-400 font-bold text-sm">Total Working hour</p>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-black text-white">81:45:04</h3>
              <span className="text-teal-400 font-bold text-sm flex items-center"><ArrowUpRight size={14} className="mr-1" /> 17%</span>
            </div>
          </div>
          <div className="w-full bg-white/5 h-px my-8"></div>
          <div className="space-y-2">
            <p className="text-slate-400 font-bold text-sm">Total Activity</p>
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-black text-white">75 Task</h3>
              <span className="text-coral-400 font-bold text-sm flex items-center text-[#ff4b6b]"><ArrowDownRight size={14} className="mr-1" /> 15%</span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white">Activity</h2>
            <button className="text-slate-500"><MoreVertical size={16} /></button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            <ActivityItem user="Selvia Devis" action="added comment on" project="Project Management" time="Just Now" color="#ff4b6b" />
            <ActivityItem user="Bryan" action="invited you to" project="Project Nexttask" time="2 hours ago" color="#00d1ff" />
            <ActivityItem user="John" action="added comment on" project="Project Management" time="Yesterday" color="#ffc107" />
          </div>
        </div>
      </div>

      {/* Bottom Row: Analytics */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-white">Analytics</h2>
          <button className="bg-white/5 text-slate-400 px-6 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">Daily <MoreVertical size={14} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnalyticsTile title="Total" value="759" colorClass="analytics-card-total" icon={ClipboardList} />
          <AnalyticsTile title="Complete" value="458" colorClass="analytics-card-complete" icon={FileCheck} />
          <AnalyticsTile title="Working On" value="20" colorClass="analytics-card-working" icon={Timer} />
          <AnalyticsTile title="Pending" value="50" colorClass="analytics-card-pending" icon={Clock} />
        </div>
      </div>

    </div>
  );
};

export default DashboardView;