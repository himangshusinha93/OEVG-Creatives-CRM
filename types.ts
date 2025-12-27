export enum ClientType {
  INDIVIDUAL = 'Individual',
  CORPORATE = 'Corporate',
  AGENCY = 'Agency'
}

export enum ProjectStatus {
  INQUIRY = 'Inquiry',
  QUOTED = 'Quoted',
  CONFIRMED = 'Confirmed',
  SCHEDULED = 'Scheduled',
  SHOT = 'Shot',
  POST_PRODUCTION = 'Post-Production',
  RAW_DELIVERY = 'Delivery 1: Raw files',
  FINAL_DELIVERY = 'Delivery 2: Edited Output',
  DELIVERED = 'Delivered',
  CLOSED = 'Closed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

export enum CoreService {
  PHOTOGRAPHY = 'Photography',
  VIDEOGRAPHY = 'Videography',
  POST_PRODUCTION = 'Post-Production',
  HYBRID = 'Hybrid'
}

export interface User {
  username: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  address: string;
  totalRevenue: number;
  pastProjects: number;
}

export interface Project {
  // 1. Identity & Context
  id: string;
  title: string;
  status: ProjectStatus;
  creationDate: string;
  projectOwner: string;

  // 2. Client Information
  clientId: string;
  clientName: string;
  clientType: ClientType;
  primaryContact: string;
  phone: string;
  email: string;
  location: string;
  referenceSource?: string;

  // 3. Classification
  category: 'Wedding' | 'Event' | 'Corporate' | 'Music Video' | 'Other';
  tier: 'Standard' | 'Premium' | 'Luxury';
  type: CoreService; // Project Nature
  selectedPackage?: string;
  startingPrice?: number;

  // 4. Timeline & Schedule
  shootType: 'Single-day' | 'Multi-day';
  shootDates: string[];
  timeSlot: 'Half-Day' | 'Full-Day' | 'Custom';
  deliveryDeadline: string;
  eventLocations: string;

  // 5. Scope Overview
  servicesIncluded: string;
  specialRequirements?: string;
  clientExpectations?: string;
  constraints?: string;

  // 6. Quotation
  quotationId?: string;
  budget: number; // Final Value

  // 7. Pipeline & Execution
  pipelineStage: ProjectStatus;
  lastCompletedStage?: string;
  nextActionRequired?: string;
  responsibleRole?: string;
  blockers?: string;

  // 8. Resource Snapshot
  crewAssigned: boolean;
  equipmentAssigned: boolean;
  freelancersInvolved: boolean;

  // 9. Financial Overview
  invoiceStatus: 'Not Created' | 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  advanceReceived: boolean;
  outstandingAmount: number;
  estimatedMargin?: number;

  // 10. Communication & Notes
  internalNotes?: string;
  communicationNotes?: string;
  specialCommitments?: string;
  redFlags?: string;

  // 11. Audit & Control
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  aiInteractionLog?: string;

  // 12. Attachments & References
  contractLink?: string;
  driveLink?: string;
  
  // Backward compatibility fields used in some components
  date: string; // Map to shootDates[0]
  progress?: number;
  assignedTeam?: string[];
}

export interface Order extends Project {
  orderNumber: string;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  items: QuotationItem[];
}

export interface PriceVariant {
  id: string;
  name: string;
  priceDifference: number;
  variantPrice: number;
  status: 'In stock' | 'Out of stock' | 'Available' | 'Busy';
  isVisible: boolean;
}

export interface Asset {
  id: string;
  name: string;
  category: 'Camera' | 'Lens' | 'Light' | 'Audio' | 'Drone' | 'Accessory';
  status: 'Available' | 'In Use' | 'Maintenance';
  cost: number;
  rentalRate: number;
  assignedToId?: string;
  variants?: PriceVariant[];
  projectTypes?: CoreService[];
  suitableCategories?: string[];
}

export interface Freelancer {
  id: string;
  name: string;
  role: 'Photographer' | 'Cinematographer' | 'Editor' | 'Drone Pilot' | 'Designer' | 'Influencer';
  level: 'Junior' | 'Mid' | 'Senior';
  ratePerDay: number;
  rating: number;
  status: 'Available' | 'On Shoot' | 'Vacation';
  verified: boolean;
  variants?: PriceVariant[];
  suitableCategories?: string[];
  expertise?: CoreService[];
}

export interface QuotationItem {
  description: string;
  quantity: number;
  price: number;
  type: 'catalog' | 'manual' | 'resource';
}

export enum Tab {
  HOME = 'Home',
  PIPELINE = 'Pipeline',
  PROJECTS = 'Projects',
  SALES = 'Sales Hub',
  FINANCES = 'Finances',
  CATALOG = 'Global Catalog',
  SERVICES = 'Services',
  EQUIPMENT = 'Equipment Inventory',
  CONTRACTORS = 'Talent Pool',
  BOOKING_CALENDAR = 'Booking Calendar',
  CLIENTS = 'Client Directory',
  ADMIN = 'System Control'
}

export interface AgencyConfig {
  publicPortfolio: boolean;
  autoInvoicing: boolean;
  aiScoping: boolean;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
}

export interface PlanSubItem {
  id: string;
  name: string;
  price: number;
  isMandatory: boolean;
}

export interface ServiceItem {
  id: string;
  pillar: CoreService;
  category: string;
  planName: string;
  price: number;
  rateType: 'Fixed' | 'Hourly' | 'Day Rate';
  description: string;
  items: PlanSubItem[];
  portfolioLink?: string;
  themeIndex?: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  startDate: string;
  endDate: string;
  expiryDate: string;
  projectType: CoreService;
  tier: 'Standard' | 'Premium';
  items: QuotationItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
}

export interface Coupon {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  expiry: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'QuotationEdit' | 'QuotationDelete' | 'System';
}