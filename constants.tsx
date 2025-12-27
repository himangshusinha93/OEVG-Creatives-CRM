import { 
  Home, 
  Library, 
  ShoppingBag, 
  CalendarDays, 
  Users, 
  ShieldCheck,
  Camera,
  Layers,
  UserCheck,
  FileText,
  CreditCard,
  Ticket,
  LayoutGrid,
  Briefcase,
  DollarSign,
  Package,
  Wrench,
  Scissors
} from 'lucide-react';
import { Client, ClientType, Project, ProjectStatus, Asset, Freelancer, Tab, Invoice, ServiceItem, Order, PriceVariant, CoreService, Quotation } from './types';

export const NAV_ITEMS = [
  { id: Tab.HOME, label: 'Home', icon: <Home size={18} /> },
  { id: Tab.SERVICES, label: 'Services', icon: <Layers size={18} /> },
  { id: Tab.PIPELINE, label: 'Pipeline', icon: <LayoutGrid size={18} /> },
  { id: Tab.PROJECTS, label: 'Project Vault', icon: <Briefcase size={18} /> },
  { 
    id: Tab.SALES, 
    label: 'Sales & Ops', 
    icon: <ShoppingBag size={18} />,
    subItems: [
      { id: 'quotations', label: 'Quotations', icon: <FileText size={14} /> },
      { id: Tab.FINANCES, label: 'Invoicing/Finance', icon: <DollarSign size={14} /> },
      { id: 'orders', label: 'Orders', icon: <CreditCard size={14} /> },
      { id: 'coupons', label: 'Discount Codes', icon: <Ticket size={14} /> }
    ]
  },
  { 
    id: Tab.CATALOG, 
    label: 'Resource Hub', 
    icon: <Library size={18} />,
    subItems: [
      { id: Tab.EQUIPMENT, label: 'Gear Inventory', icon: <Wrench size={14} /> },
      { id: Tab.CONTRACTORS, label: 'Freelancer Pool', icon: <UserCheck size={14} /> }
    ]
  },
  { id: Tab.BOOKING_CALENDAR, label: 'Availability Calendar', icon: <CalendarDays size={18} /> },
  { id: Tab.CLIENTS, label: 'Client Database', icon: <Users size={18} /> },
  { id: Tab.ADMIN, label: 'Admin Terminal', icon: <ShieldCheck size={18} /> },
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', type: ClientType.CORPORATE, email: 'contact@acme.com', phone: '+91 8811186951', address: 'Guwahati, Assam', totalRevenue: 45000, pastProjects: 3 },
  { id: '2', name: 'Ritu & Sandeep', type: ClientType.INDIVIDUAL, email: 'ritu@wedding.in', phone: '+91 9900011223', address: 'Shillong, Meghalaya', totalRevenue: 12500, pastProjects: 1 },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'PRJ-2024-001', 
    title: 'The Wedding of Ritu & Sandeep', 
    status: ProjectStatus.SHOT,
    creationDate: '2023-10-01',
    projectOwner: 'System Admin',
    
    clientId: '2', 
    clientName: 'Ritu & Sandeep', 
    clientType: ClientType.INDIVIDUAL,
    primaryContact: 'Ritu Sharma',
    phone: '+91 9900011223',
    email: 'ritu@wedding.in',
    location: 'Shillong, Meghalaya',
    referenceSource: 'Instagram',

    category: 'Wedding',
    tier: 'Premium',
    type: CoreService.PHOTOGRAPHY,
    selectedPackage: 'Classic Cinematic',
    startingPrice: 6850,

    shootType: 'Multi-day',
    shootDates: ['2023-11-12', '2023-11-13'],
    timeSlot: 'Full-Day',
    deliveryDeadline: '2023-12-15',
    eventLocations: 'Pinewood Hotel, Shillong',

    servicesIncluded: 'Cinematic Photography, Raw Transfers, Drone Stills',
    specialRequirements: 'Drone Aerials requested for ceremony',
    clientExpectations: 'Vibrant, high-contrast edits',
    constraints: 'Outdoor lighting sensitivity',

    quotationId: 'QT-101-99',
    budget: 12500,

    pipelineStage: ProjectStatus.SHOT,
    nextActionRequired: 'Import raw files to station',
    responsibleRole: 'Creative Lead',

    crewAssigned: true,
    equipmentAssigned: true,
    freelancersInvolved: true,

    invoiceStatus: 'Paid',
    paymentStatus: 'Paid',
    advanceReceived: true,
    outstandingAmount: 0,
    estimatedMargin: 35,

    internalNotes: 'VIP wedding, ensure Rahul is lead',
    createdBy: 'System Admin',
    lastModifiedBy: 'System Admin',
    lastModifiedDate: '2023-11-14',
    
    // Legacy mapping
    date: '2023-11-12', 
    progress: 60,
    assignedTeam: ['f1', 'f3']
  },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'a1', name: 'Sony 6000', category: 'Camera', status: 'Available', cost: 45000, rentalRate: 1500, projectTypes: [CoreService.PHOTOGRAPHY], suitableCategories: ['Crop sensor camera'] },
  { id: 'a2', name: 'Canon M50', category: 'Camera', status: 'Available', cost: 55000, rentalRate: 2100, projectTypes: [CoreService.PHOTOGRAPHY], suitableCategories: ['Crop sensor camera'] },
  { id: 'a3', name: 'Sony SII', category: 'Camera', status: 'In Use', cost: 180000, rentalRate: 3800, projectTypes: [CoreService.PHOTOGRAPHY, CoreService.VIDEOGRAPHY], suitableCategories: ['Full sensor camera'] },
  { id: 'e1', name: 'Ronin RC Gimbal', category: 'Accessory', status: 'Available', cost: 35000, rentalRate: 900, projectTypes: [CoreService.VIDEOGRAPHY], suitableCategories: ['Stabilization'] },
  { id: 'e2', name: 'Godox LC500 Light Stick', category: 'Light', status: 'Available', cost: 15000, rentalRate: 250, projectTypes: [CoreService.PHOTOGRAPHY, CoreService.VIDEOGRAPHY], suitableCategories: ['RGB Lighting'] },
];

export const MOCK_FREELANCERS: Freelancer[] = [
  { id: 'f1', name: 'Rahul Sinha', role: 'Photographer', level: 'Mid', ratePerDay: 2000, rating: 4.8, status: 'Available', verified: true, expertise: [CoreService.PHOTOGRAPHY], suitableCategories: ['Traditional Photography'] },
  { id: 'f2', name: 'Samrat Sinha', role: 'Photographer', level: 'Mid', ratePerDay: 2300, rating: 4.9, status: 'Available', verified: true, expertise: [CoreService.PHOTOGRAPHY], suitableCategories: ['Classic Wedding'] },
  { id: 'f3', name: 'Rupom Sinha', role: 'Photographer', level: 'Mid', ratePerDay: 2000, rating: 4.7, status: 'Available', verified: true, expertise: [CoreService.PHOTOGRAPHY], suitableCategories: ['Traditional Photography'] },
  { id: 'f4', name: 'Shiv Narayan Das', role: 'Photographer', level: 'Senior', ratePerDay: 1900, rating: 5.0, status: 'Available', verified: true, expertise: [CoreService.PHOTOGRAPHY], suitableCategories: ['Expert Traditional'] },
];

export const MOCK_SERVICES: ServiceItem[] = [
  { 
    id: 's1', 
    pillar: CoreService.PHOTOGRAPHY, 
    category: 'Wedding', 
    planName: 'Traditional Package', 
    price: 5200, 
    rateType: 'Fixed', 
    description: 'Entry-level traditional coverage.',
    themeIndex: 1,
    portfolioLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    items: [
      { id: 'i1', name: 'Single Photographer (Crop Sensor)', price: 3500, isMandatory: true },
      { id: 'i2', name: 'Basic Retouching (50 Photos)', price: 1000, isMandatory: true },
      { id: 'i3', name: 'Online Delivery Hub', price: 700, isMandatory: true },
      { id: 'i4', name: 'Printed Hard-copy Album', price: 4000, isMandatory: false }
    ]
  },
  { 
    id: 's2', 
    pillar: CoreService.PHOTOGRAPHY, 
    category: 'Wedding', 
    planName: 'Classic Cinematic', 
    price: 6850, 
    rateType: 'Fixed', 
    description: 'High-end cinematic wedding stills.',
    themeIndex: 0,
    items: [
      { id: 'i5', name: 'Premium Photographer (Full Sensor)', price: 4850, isMandatory: true },
      { id: 'i6', name: 'Professional Editing (100 Photos)', price: 2000, isMandatory: true },
      { id: 'i7', name: 'Unlimited Raw Transfers', price: 0, isMandatory: true },
      { id: 'i8', name: 'Drone Aerial Shots', price: 3000, isMandatory: false }
    ]
  },
  { 
    id: 's3', 
    pillar: CoreService.VIDEOGRAPHY, 
    category: 'Event', 
    planName: 'Recap Protocol', 
    price: 3000, 
    rateType: 'Fixed', 
    description: 'Standard event recap video.',
    themeIndex: 2,
    items: [
      { id: 'i9', name: 'Cinematographer (3 Hours)', price: 2000, isMandatory: true },
      { id: 'i10', name: 'Video Editing (30 Mins)', price: 1000, isMandatory: true }
    ]
  }
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'QT-2024-881',
    clientId: '1',
    clientName: 'Acme Corp',
    date: '2024-03-15',
    startDate: '2024-04-10',
    endDate: '2024-04-10',
    expiryDate: '2024-03-29',
    projectType: CoreService.VIDEOGRAPHY,
    tier: 'Premium',
    items: [
      { description: 'Recap Protocol', quantity: 1, price: 3000, type: 'catalog' },
      { description: 'Drone Aerial Coverage', quantity: 1, price: 2500, type: 'resource' },
      { description: '4K Cinema Delivery', quantity: 1, price: 1500, type: 'manual' }
    ],
    totalAmount: 7000,
    status: 'Sent'
  },
  {
    id: 'QT-2024-912',
    clientId: '2',
    clientName: 'Ritu & Sandeep',
    date: '2023-11-01',
    startDate: '2023-11-12',
    endDate: '2023-11-13',
    expiryDate: '2023-11-15',
    projectType: CoreService.PHOTOGRAPHY,
    tier: 'Premium',
    items: [
      { description: 'Classic Cinematic', quantity: 1, price: 6850, type: 'catalog' },
      { description: 'Luxury Leather Album', quantity: 1, price: 4000, type: 'manual' },
      { description: 'Additional Lead Photographer', quantity: 1, price: 1650, type: 'resource' }
    ],
    totalAmount: 12500,
    status: 'Accepted'
  }
];

export const FINANCIAL_DATA = [
  { month: 'Jan', revenue: 120000, expenses: 40000 },
  { month: 'Feb', revenue: 190000, expenses: 65000 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-OEVG-001', clientName: 'Ritu & Sandeep', amount: 12500, date: '2023-11-15', status: 'Paid' },
];