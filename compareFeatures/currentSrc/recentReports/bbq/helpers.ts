import {
  withDefault,
  StringParam,
  NumberParam,
  BooleanParam,
  QueryParamConfig,
  createEnumArrayParam,
  createEnumParam,
} from 'use-query-params';
import { useMicroserviceRequest } from '@/auth/index';
import {
  ReportType,
  SortBy,
  SortDirection,
  QueryParams,
  FilteredParams,
} from './types';
import {
  RecentReportsRawData,
  RecentReportsDataSerialized,
  RecentReportSerialized,
} from '../Interfaces';
import { RecentReportsSerializer } from '../recentReportsSerializer';

const BBQ_URL = '/bbq/reports';

const reportTypeOptions: ReportType[] = [
  'detailed_person_report',
  'social_network_report',
  'property_report',
  'reverse_phone_report',
  'professional_contact_search',
  'fraud_report',
  'estate_value_report',
  'dark_web_report',
  'username_report',
  'sex_offender_report',
  'detailed_business_report',
  'vehicle_report',
  'contact_report',
];
const sortByOptions: SortBy[] = ['created_at', 'updated_at', 'last_viewed_at'];
const sortDirectionOptions: SortDirection[] = ['asc', 'desc'];

const isKey = <T extends object>(x: T, k: PropertyKey): k is keyof T => k in x;

export const stringifyParams = (params: QueryParams): FilteredParams =>
  Object.keys(params).reduce(
    (filteredParams: FilteredParams, key: PropertyKey) => {
      if (
        isKey<QueryParams>(params, key) &&
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ''
      ) {
        const value = params[key];

        if (Array.isArray(value)) {
          filteredParams[key] = value.map((v) => String(v));
        } else {
          filteredParams[key] = String(value);
        }
      }

      return filteredParams;
    },
    {}
  );

export const generateQueryConfig = () => {
  const DefaultPage = withDefault(NumberParam, 1);
  const DefaultSearchBy = withDefault(StringParam, '');
  const DefaultReportType = createEnumArrayParam<ReportType>(reportTypeOptions);
  const DefaultSortBy = withDefault(
    createEnumParam<SortBy>(sortByOptions),
    'last_viewed_at'
  ) as QueryParamConfig<SortBy>;
  const DefaultSortDirection = withDefault(
    createEnumParam<SortDirection>(sortDirectionOptions),
    'desc'
  ) as QueryParamConfig<SortDirection>;

  return {
    page: DefaultPage,
    report_type: DefaultReportType,
    search_by: DefaultSearchBy,
    sort_by: DefaultSortBy,
    sort_direction: DefaultSortDirection,
    monitored: BooleanParam,
    upgraded: BooleanParam,
    claimed: BooleanParam,
  };
};

const transformRecentReportsData = (
  data: RecentReportsRawData
): RecentReportsDataSerialized => {
  const serializedData = RecentReportsSerializer({ data, isoDates: true });

  serializedData.reports = serializedData.reports.filter(
    (report: RecentReportSerialized) => report.reportType !== 'dark_web_report'
  );

  return serializedData;
};

export const useRecentReports = (queryParams: FilteredParams) =>
  useMicroserviceRequest<RecentReportsRawData, RecentReportsDataSerialized>(
    BBQ_URL,
    'bbq',
    {
      queryParams: queryParams,
      mode: 'cors',
    },
    transformRecentReportsData
  );
