import React, { useState } from 'react';
import { Client, ClientType } from '../types';
import { Mail, Phone, MoreVertical, User, X, Plus, Search, Filter, SortAsc, Edit2, Trash2, MapPin } from 'lucide-react';

const ClientList: React.FC<{ 
    clients: Client[], 
    onAddClient: (c: Client) => void,
    onEditClient: (c: Client) => void,
    onDeleteClient: (id: string) => void
}> = ({ clients, onAddClient, onEditClient, onDeleteClient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '', type: ClientType.CORPORATE });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'revenue'>('name');

  const submitAdd = () => {
    if (editingClient) {
      onEditClient({ ...editingClient, ...newClient });
    } else {
      onAddClient({
          id: (clients.length + 1).toString(),
          ...newClient,
          totalRevenue: 0,
          pastProjects: 0
      });
    }
    closeModal();
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setNewClient({ name: client.name, email: client.email, phone: client.phone, address: client.address, type: client.type });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setNewClient({ name: '', email: '', phone: '', address: '', type: ClientType.CORPORATE });
  };

  const filteredClients = clients
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => filterType === 'All' || c.type === filterType)
    .sort((a, b) => {
        if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
        return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between glass-card p-6 rounded-[2.5rem] shadow-xl border-white/5">
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-2.5 flex-1 max-w-sm">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium text-slate-300 placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:ring-0 focus:text-white transition-colors"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value={ClientType.CORPORATE}>Corporate</option>
            <option value={ClientType.AGENCY}>Agency</option>
            <option value={ClientType.INDIVIDUAL}>Individual</option>
          </select>
          <select 
            className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:ring-0 focus:text-white transition-colors"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">A-Z Name</option>
            <option value="revenue">Highest LTV</option>
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/10 active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} /> Register
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] shadow-2xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-10 py-6">Entity Identity</th>
                <th className="px-10 py-6">Classification</th>
                <th className="px-10 py-6">Contact Gateway</th>
                <th className="px-10 py-6">LTV Velocity</th>
                <th className="px-10 py-6 text-right">Interactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-all duration-300 group">
                  <td className="px-10 py-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-cyan-400 flex items-center justify-center mr-5 font-black text-lg border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-white text-base tracking-tight">{client.name}</div>
                        <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          <MapPin size={10} className="mr-1" /> {client.address || 'No Address'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      client.type === ClientType.CORPORATE ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      client.type === ClientType.AGENCY ? 'bg-magenta-500/10 text-magenta-400 border-magenta-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center text-xs text-slate-400 font-bold tracking-tight">
                        <Mail size={12} className="mr-3 text-slate-600" /> {client.email}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 font-medium">
                        <Phone size={12} className="mr-3 text-slate-600" /> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="font-black text-white text-lg italic tracking-tighter">${client.totalRevenue.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{client.pastProjects} Deliveries</div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(client)} className="p-2.5 text-slate-500 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"><Edit2 size={18} /></button>
                      <button onClick={() => onDeleteClient(client.id)} className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-white/5 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="glass-card rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border-white/10 animate-in zoom-in duration-300">
                <div className="p-8 bg-[#0a0c1a] text-white flex justify-between items-center border-b border-white/5">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">{editingClient ? 'Revise Profile' : 'Authorize Registration'}</h3>
                    <button onClick={closeModal} className="hover:text-cyan-400 transition-colors"><X size={20} /></button>
                </div>
                <div className="p-10 space-y-6 bg-slate-900/40">
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Legal Identity</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white placeholder:text-slate-600 transition-all"
                            placeholder="e.g. Acme Creative Agency"
                            value={newClient.name}
                            onChange={e => setNewClient({...newClient, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Operations Base</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium text-sm text-white placeholder:text-slate-600 transition-all"
                            placeholder="Address details..."
                            rows={2}
                            value={newClient.address}
                            onChange={e => setNewClient({...newClient, address: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Entity Category</label>
                        <select 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-white transition-all appearance-none"
                            value={newClient.type}
                            onChange={e => setNewClient({...newClient, type: e.target.value as ClientType})}
                        >
                            <option value={ClientType.CORPORATE} className="bg-slate-900">Corporate Entity</option>
                            <option value={ClientType.INDIVIDUAL} className="bg-slate-900">Individual Specialist</option>
                            <option value={ClientType.AGENCY} className="bg-slate-900">Partner Agency</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">E-Mail</label>
                            <input 
                                type="email" 
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-sm text-white transition-all"
                                value={newClient.email}
                                onChange={e => setNewClient({...newClient, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Comm Link</label>
                            <input 
                                type="text" 
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none font-bold text-sm text-white transition-all"
                                value={newClient.phone}
                                onChange={e => setNewClient({...newClient, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={submitAdd}
                        className="w-full bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-2xl font-black uppercase mt-4 shadow-xl shadow-cyan-500/10 active:scale-95 transition-all text-xs tracking-widest italic"
                    >
                        {editingClient ? 'Apply Protocol' : 'Initialize Database Entry'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;