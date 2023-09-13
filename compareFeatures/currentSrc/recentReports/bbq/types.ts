import { DecodedValueMap, QueryParamConfig } from 'use-query-params';

type Nullable<T> = T | null | undefined;

export type ReportType =
  | 'detailed_person_report'
  | 'social_network_report'
  | 'property_report'
  | 'reverse_phone_report'
  | 'professional_contact_search'
  | 'fraud_report'
  | 'estate_value_report'
  | 'dark_web_report'
  | 'username_report'
  | 'sex_offender_report'
  | 'detailed_business_report'
  | 'vehicle_report'
  | 'contact_report';
export type SortBy = 'created_at' | 'updated_at' | 'last_viewed_at';
export type SortDirection = 'asc' | 'desc';

type PageParam = number;
type ReportTypeParam = ReportType[];
type SearchByParam = string;
type SortByParam = SortBy;
type SortDirectionParam = SortDirection;
type MonitoredParam = boolean;
type UpgradedParam = boolean;
type ClaimedParam = boolean;

type QueryConfig = {
  page: QueryParamConfig<PageParam>;
  report_type: QueryParamConfig<Nullable<ReportTypeParam>>;
  search_by: QueryParamConfig<Nullable<SearchByParam>>;
  sort_by: QueryParamConfig<SortByParam>;
  sort_direction: QueryParamConfig<SortDirectionParam>;
  monitored: QueryParamConfig<Nullable<MonitoredParam>>;
  upgraded: QueryParamConfig<Nullable<UpgradedParam>>;
  claimed: QueryParamConfig<Nullable<ClaimedParam>>;
};

export type QueryParams = DecodedValueMap<QueryConfig>;
export type FilteredParams = {
  [key: string]: string | string[];
};

export type ReportTypeOption = {
  id: ReportType;
  display: string;
  eventLabel: string;
};
