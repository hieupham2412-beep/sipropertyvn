export interface Project {
  id: string;
  name: string;
  tagline: string;
  developer: string;
  location: string;
  type: string;
  price: string;
  scale: string;
  status: string;
  badge: string;
  image: string;
  description: string;
  features: string[];
  order?: number;
  landingUrl?: string;
  actionType?: 'modal' | 'landing';
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  awards: string;
  phone: string;
  zalo: string;
  email: string;
  isFeatured: boolean;
  image: string;
  bio: string;
  order?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Báo chí' | 'Dự án' | 'Thị trường' | 'Cẩm nang đầu tư' | string;
  author: string;
  date: string;
  readTime: string;
  badge: string;
  sourceUrl?: string;
  image: string;
  summary: string;
  content: string;
  order?: number;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  desc: string;
  order?: number;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  type: string;
  imageUrl: string;
  isHot?: boolean;
}

export interface AboutValue {
  id: string;
  title: string;
  desc: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  subtitle: string;
  quoteTitle: string;
  quoteText1: string;
  quoteText2: string;
  sourceLabel: string;
  sourceUrl: string;
  values: AboutValue[];
}

export interface CareerBenefit {
  id: string;
  title: string;
  desc: string;
}

export interface CareersContent {
  badge: string;
  title: string;
  subtitle: string;
  benefits: CareerBenefit[];
  jobs: JobPosition[];
}

export interface ContactFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ContactContent {
  badge: string;
  title: string;
  subtitle: string;
  hotline: string;
  hotlineAlt: string;
  email: string;
  hcmOfficeTitle: string;
  hcmOfficeAddress: string;
  vtOfficeTitle: string;
  vtOfficeAddress: string;
  faqs: ContactFAQ[];
}

export interface GeneralSettings {
  siteTitle: string;
  brandName: string;
  logoUrl: string;
  hotline: string;
  vipCtaText: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBgImage: string;
  metric1Value: string;
  metric1Label: string;
  metric2Value: string;
  metric2Label: string;
  metric3Value: string;
  metric3Label: string;
  metric4Value: string;
  metric4Label: string;
  homeProjectsBadge: string;
  homeProjectsTitle: string;
  homeNewsBadge: string;
  homeNewsTitle: string;
  footerDescription: string;
  footerQuote: string;
  footerHodecoTitle: string;
  footerHodecoDesc: string;
  footerCopyright: string;
  customHtmlBanner?: string;
  adminPin?: string;
}

export interface PageHeadersSettings {
  advisorsBadge: string;
  advisorsTitle: string;
  advisorsSubtitle: string;
  projectsBadge: string;
  projectsTitle: string;
  projectsSubtitle: string;
  newsBadge: string;
  newsTitle: string;
  newsSubtitle: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'appointment' | 'closed' | 'cancelled';

export interface CustomerInquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  projectInterest?: string;
  message?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
}

export interface SiteData {
  general: GeneralSettings;
  pageHeaders: PageHeadersSettings;
  about: AboutContent;
  projects: Project[];
  advisors: Advisor[];
  news: NewsArticle[];
  careers: CareersContent;
  contact: ContactContent;
  inquiries?: CustomerInquiry[];
  savedHtmlSnippet?: string;
  updatedAt?: string;
  adminPin?: string;
}

export type PageId = 'home' | 'about' | 'projects' | 'advisors' | 'news' | 'careers' | 'contact' | 'admin' | 'html-import';
export type ActiveTab = 'guide' | 'paste-preview' | 'demo-site';

