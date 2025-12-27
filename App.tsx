import React, { useState, useEffect } from 'react';
import { NAV_ITEMS, MOCK_CLIENTS, MOCK_PROJECTS, MOCK_ASSETS, MOCK_FREELANCERS, MOCK_INVOICES, MOCK_SERVICES, MOCK_QUOTATIONS } from './constants';
import { Tab, Client, Project, Asset, Freelancer, ProjectStatus, AgencyConfig, Invoice, ServiceItem, Quotation, SystemLog, Order, User, Coupon } from './types';
import DashboardView from './components/DashboardView';
import ClientList from './components/ClientList';
import AdminPanel from './components/AdminPanel';
import CalendarView from './components/CalendarView';
import CatalogView from './components/CatalogView';
import SalesView from './components/SalesView';
import ProjectBoard from './components/ProjectBoard';
import ProjectsView from './components/ProjectsView';
import FinancesView from './components/FinancesView';
import ServicesView from './components/ServicesView';
import EquipmentView from './components/EquipmentView';
import ContractorManagement from './components/ContractorManagement';
import AIAssistant from './components/AIAssistant';
import LoginView from './components/LoginView';
import { Sparkles, Bell, Search, Menu, CheckCircle, AlertCircle, ChevronDown, ChevronRight, LogOut, Sun, MessageSquare, Maximize2, Settings2 } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lc_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState<Tab[]>([Tab.HOME]);
  
  // App State
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('lc_clients');
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('lc_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [contractors, setContractors] = useState<Freelancer[]>(() => {
    const saved = localStorage.getItem('lc_contractors');
    return saved ? JSON.parse(saved) : MOCK_FREELANCERS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('lc_assets');
    return saved ? JSON.parse(saved) : MOCK_ASSETS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('lc_invoices');
    return saved ? JSON.parse(saved) : MOCK_INVOICES;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('lc_services');
    return saved ? JSON.parse(saved) : MOCK_SERVICES;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('lc_quotations');
    return saved ? JSON.parse(saved) : MOCK_QUOTATIONS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('lc_coupons');
    return saved ? JSON.parse(saved) : [
      { code: 'WINTER20', discountType: 'Percentage', value: 20, expiry: '2024-12-31' },
      { code: 'FIRST500', discountType: 'Fixed', value: 500, expiry: '2025-01-01' }
    ];
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('lc_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<AgencyConfig>({
    publicPortfolio: true,
    autoInvoicing: false,
    aiScoping: true
  });

  const [notifications, setNotifications] = useState<{id: number, text: string, type: 'success' | 'error'}[]>([]);

  useEffect(() => {
    localStorage.setItem('lc_clients', JSON.stringify(clients));
    localStorage.setItem('lc_projects', JSON.stringify(projects));
    localStorage.setItem('lc_contractors', JSON.stringify(contractors));
    localStorage.setItem('lc_assets', JSON.stringify(assets));
    localStorage.setItem('lc_invoices', JSON.stringify(invoices));
    localStorage.setItem('lc_services', JSON.stringify(services));
    localStorage.setItem('lc_quotations', JSON.stringify(quotations));
    localStorage.setItem('lc_coupons', JSON.stringify(coupons));
    localStorage.setItem('lc_logs', JSON.stringify(logs));
    if (user) {
      localStorage.setItem('lc_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('lc_auth');
    }
  }, [clients, projects, contractors, assets, invoices, services, quotations, coupons, logs, user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    addNotification(`Authentication successful. Session started for ${newUser.name}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lc_auth');
  };

  const addNotification = (text: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const toggleNav = (tab: Tab) => {
    setExpandedNav(prev => prev.includes(tab) ? prev.filter(t => t !== tab) : [...prev, tab]);
  };

  const handleAddToCartFromService = (items: any[]) => {
    addNotification("Plan components added to cart workflow.");
    // Navigating to Quotations within Sales Hub to show the added items
    setActiveTab(Tab.SALES);
    setActiveSubTab('quotations');
  };

  const renderContent = () => {
    if (activeSubTab === Tab.FINANCES) return <FinancesView invoices={invoices} onAddInvoice={(inv) => { setInvoices(p => [...p, inv]); addNotification("Invoice Registered"); }} onNotify={addNotification} />;
    
    if (activeSubTab === Tab.EQUIPMENT) return (
      <EquipmentView 
        assets={assets} 
        contractors={contractors} 
        clients={clients} 
        onAddAsset={(a) => { setAssets(p => [...p, a]); addNotification("Asset Archived"); }} 
        onUpdateAssetStatus={(id) => setAssets(p => p.map(a => a.id === id ? {...a, status: a.status === 'Available' ? 'In Use' : 'Available'} : a))} 
        onUpdateAssetOptions={(id, options) => setAssets(p => p.map(a => a.id === id ? {...a, ...options} : a))}
        onDeleteAsset={(id) => { setAssets(p => p.filter(a => a.id !== id)); addNotification("Asset Removed", "error"); }}
      />
    );
    
    if (activeSubTab === Tab.CONTRACTORS) return (
      <ContractorManagement 
        contractors={contractors} 
        onAddContractor={(f) => { setContractors(p => [...p, f]); addNotification("Specialist Onboarded"); }} 
        onUpdateRating={(id, r) => setContractors(p => p.map(f => f.id === id ? {...f, rating: r} : f))} 
        onUpdateContractorOptions={(id, options) => setContractors(p => p.map(f => f.id === id ? {...f, ...options} : f))}
        onDeleteContractor={(id) => { setContractors(p => p.filter(f => f.id !== id)); addNotification("Contractor Removed", "error"); }}
      />
    );

    switch (activeTab) {
      case Tab.HOME: 
        return <DashboardView projects={projects} clients={clients} onNavigate={setActiveTab} />;
      case Tab.SERVICES:
        return (
          <ServicesView 
            user={user}
            services={services} 
            onAddService={(s) => setServices(p => [...p, s])} 
            onUpdateService={(s) => setServices(p => p.map(it => it.id === s.id ? s : it))}
            onDeleteService={(id) => { setServices(p => p.filter(s => s.id !== id)); addNotification("Service Blueprint Purged", "error"); }}
            onDeleteCategory={(pillar, category) => {
              setServices(p => p.filter(s => !(s.pillar === pillar && s.category === category)));
              addNotification(`${category} Service Group Purged`, "error");
            }}
            onNotify={addNotification} 
            onAddToCart={handleAddToCartFromService}
          />
        );
      case Tab.PIPELINE:
        return <ProjectBoard projects={projects} onUpdateStatus={(id, s) => setProjects(p => p.map(it => it.id === id ? {...it, status: s} : it))} onAddProject={(p) => { setProjects(pr => [p, ...pr]); addNotification("Project Created"); }} clients={clients} />;
      case Tab.PROJECTS:
        return <ProjectsView 
          projects={projects} 
          clients={clients} 
          invoices={invoices} 
          contractors={contractors} 
          onAddProject={(p) => { setProjects(pr => [p, ...pr]); addNotification("Project Folder Initialized"); }}
          onEditProject={(p) => { setProjects(pr => pr.map(item => item.id === p.id ? p : item)); addNotification("Project Card Updated"); }}
          onDeleteProject={(id) => { setProjects(pr => pr.filter(item => item.id !== id)); addNotification("Project Archive Purged", "error"); }}
        />;
      case Tab.CATALOG:
        return <CatalogView assets={assets} freelancers={contractors} packages={services} activeSubTab={activeSubTab} />;
      case Tab.SALES:
        return <SalesView 
          quotations={quotations} 
          orders={projects as any} 
          clients={clients} 
          services={services} 
          contractors={contractors} 
          assets={assets}
          onAddQuotation={(q) => { setQuotations(p => [q, ...p]); addNotification("Quotation Saved"); }}
          onEditQuotation={(q) => { setQuotations(p => p.map(it => it.id === q.id ? q : it)); addNotification("Quotation Updated"); }}
          onDeleteQuotation={(id) => { setQuotations(p => p.filter(it => it.id !== id)); addNotification("Quotation Purged", "error"); }}
          coupons={coupons}
          onAddCoupon={(c) => { setCoupons(p => [...p, c]); addNotification("Discount Code Live"); }}
          onDeleteCoupon={(code) => { setCoupons(p => p.filter(c => c.code !== code)); addNotification("Coupon Revoked", "error"); }}
          logs={logs}
          activeSubTab={activeSubTab}
        />;
      case Tab.BOOKING_CALENDAR:
        return <CalendarView projects={projects} onAddProject={(p) => { setProjects(pr => [p, ...pr]); addNotification("Event Booked"); }} />;
      case Tab.CLIENTS: 
        return <ClientList clients={clients} onAddClient={(c) => { setClients(p => [...p, c]); addNotification("Client Profile Created"); }} onEditClient={(c) => { setClients(p => p.map(it => it.id === c.id ? c : it)); addNotification("Profile Modified"); }} onDeleteClient={(id) => { setClients(p => p.filter(it => it.id !== id)); addNotification("Client Purged", "error"); }} />;
      case Tab.ADMIN: 
        return <AdminPanel config={config} setConfig={setConfig} onNotify={addNotification} onReset={() => { setProjects(MOCK_PROJECTS); setClients(MOCK_CLIENTS); addNotification("System Reset Complete", "error"); }} />;
      default: 
        return <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">Module Offline</div>;
    }
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-[#0b0e14] text-slate-100 font-sans selection:bg-[#ff6b3d]/30">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-slide-in glass-card ${
            n.type === 'success' ? 'border-emerald-500/50 text-emerald-400' : 'border-rose-500/50 text-rose-400'
          }`}>
            {n.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs font-bold">{n.text}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0b0e14] border-r border-white/5 transform transition-transform lg:static lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-8 gap-4 border-b border-white/5">
             <div className="w-10 h-10 bg-[#ff6b3d] rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-[#ff6b3d]/20">O</div>
             <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight leading-none uppercase italic">OEVG Creatives</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">CRM</span>
             </div>
          </div>

          <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Dashboard</p>
            {NAV_ITEMS.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    if (item.subItems) {
                      toggleNav(item.id as Tab);
                      setActiveSubTab(item.subItems[0].id);
                    } else {
                      setActiveSubTab(null);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    activeTab === item.id ? 'bg-[#ff6b3d]/10 text-[#ff6b3d]' : 'hover:bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`${activeTab === item.id ? 'text-[#ff6b3d]' : 'text-slate-500'}`}>{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {item.subItems && (
                    <span className="text-slate-600">
                      {expandedNav.includes(item.id as Tab) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </button>
                {item.subItems && expandedNav.includes(item.id as Tab) && (
                  <div className="mt-2 ml-10 space-y-1">
                    {item.subItems.map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => {
                          setActiveTab(item.id as Tab);
                          setActiveSubTab(sub.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          (activeTab === item.id && activeSubTab === sub.id) || activeSubTab === sub.id ? 'text-[#ff6b3d] font-bold' : 'text-slate-500 hover:text-white'
                        }`}
                      >
                        • {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-white/5">
             <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-rose-500/10 transition-all group"
             >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3c9cfd] to-[#ff4b6b] flex items-center justify-center text-xs font-black text-white">
                  {user ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                <div className="flex flex-col text-left flex-1">
                  <span className="text-sm font-bold text-white">{user ? user.name : 'Unknown'}</span>
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">{user ? user.role : 'Guest'}</span>
                </div>
                <LogOut size={18} className="text-slate-600 group-hover:text-rose-400" />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#0b0e14]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-8">
            <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-xl w-80">
              <Search size={18} className="text-slate-500" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-200 placeholder:text-slate-600" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <button className="text-slate-500 hover:text-white transition-colors"><Sun size={20} /></button>
             <button className="relative text-slate-500 hover:text-white transition-colors">
               <Bell size={20} />
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4b6b] rounded-full text-[9px] font-black flex items-center justify-center text-white border-2 border-[#0b0e14]">8</span>
             </button>
             <button className="text-slate-500 hover:text-white transition-colors"><MessageSquare size={20} /></button>
             <button className="text-slate-500 hover:text-white transition-colors"><Maximize2 size={20} /></button>
             <button className="text-slate-500 hover:text-white transition-colors"><Settings2 size={20} /></button>
             
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Admin'}`} alt="avatar" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#0b0e14]">
          <div className="max-w-[1600px] mx-auto">
             {renderContent()}
          </div>
        </main>
      </div>

      <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};

export default App;