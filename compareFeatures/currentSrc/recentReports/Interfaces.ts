import { Nullable } from '@/utils/helperTypes';

export type RawReportType =
  | 'social_network_report'
  | 'detailed_person_report'
  | 'username_report'
  | 'reverse_phone_report'
  | 'sex_offender_report'
  | 'property_report'
  | 'detailed_business_report';

export interface RecentReportRawData {
  age?: number;
  address?: string;
  alert_me?: boolean | null;
  city?: string;
  created_at?: string;
  email?: string;
  first_name?: string;
  full_size_image?: string | null;
  has_new_info?: boolean;
  interaction?: Record<string, unknown>;
  license_plate?: string;
  last_name?: string;
  make?: string;
  middle_name?: string | null;
  mileage?: number;
  model?: string;
  permalink: string;
  phone_number?: string;
  rating?: unknown;
  report_tier?: string;
  report_type: RawReportType;
  report_upgraded?: boolean;
  state?: string;
  search_by?: string;
  service_data?: unknown;
  tag?: string | null;
  thumb?: unknown;
  updated_at?: string;
  upgrade_options?: unknown;
  vin?: string;
  year?: number;
  username?: string;
  network?: string;
  zip_code?: string;
  domain?: string;
  no_entities?: unknown;
  carrier?: string;
  bvids?: string[];
}
export interface RecentReportsRawData {
  meta: ReportsMeta;
  polling: Record<string, unknown>;
  reports: RecentReportRawData[];
}

export interface RecentReportsDataSerialized {
  reports: RecentReportSerialized[];
  meta: ReportsMeta;
  polling: Record<string, unknown>;
}

export interface RecentReportSerialized {
  id: string;
  reportUpgraded?: boolean;
  createdAt: string;
  createdDate: string;
  updatedAt: string;
  updatedDate: string;
  alertMe?: boolean | null;
  hasNewInfo: boolean | null;
  reportType: string;
  reportTypeFormatted: string;
  detailsCityState?: string;
  reportData: string;
  details: RecentReportRawData;
}

interface ReportsMeta {
  status: number;
  free_user: boolean;
  mobile_free: boolean;
  subscription_state: string;
  report_quantities: Nullable<ReportQuantities>;
}

interface ReportQuantities {
  contact_reports_count: number;
  detailed_business_reports_count: number;
  email_reports_count: number;
  estate_value_reports_count: number;
  filtered_reports_count: number;
  fraud_reports_count: number;
  link_to_next_page: number;
  link_to_prev_page: number;
  person_reports_count: number;
  phone_reports_count: number;
  property_reports_count: number;
  report_limit: number;
  sex_offender_reports_count: number;
  total_reports_count: number;
  username_reports_count: number;
  vehicle_reports_count: number;
}
