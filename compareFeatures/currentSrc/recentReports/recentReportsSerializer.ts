import { DateUtil, formatPhone, nameize } from '@/utils/index';
import {
  RecentReportsRawData,
  RecentReportsDataSerialized,
  RecentReportRawData,
  RecentReportSerialized,
} from './Interfaces';

const ReportTypes = {
  social_network_report: 'Email',
  detailed_person_report: 'Person',
  username_report: 'Username',
  reverse_phone_report: 'Phone',
  sex_offender_report: 'Neighborhood',
  property_report: 'Property',
  detailed_business_report: 'Business',
  vehicle_report: 'Vehicle',
};

const dateParser = new DateUtil();

type RecentReportsSerializerProps = {
  data: RecentReportsRawData;
  isoDates?: boolean;
};

export function RecentReportsSerializer({
  data,
  isoDates = false,
}: RecentReportsSerializerProps): RecentReportsDataSerialized {
  const serializeReports = data.reports.map((report) => {
    return RecentReportSerializer(report, isoDates);
  });

  return {
    meta: data.meta,
    polling: data.polling,
    reports: serializeReports,
  };
}

export function RecentReportSerializer(
  report: RecentReportRawData,
  isoDates = false
): RecentReportSerialized {
  const usernameParts = report.username?.includes('@')
    ? report.username?.split('@')
    : [];
  const dateFormat = isoDates ? null : 'yyyy-MM-dd HH:mm:ss ZZZ';
  const createdAt = report.created_at || '';
  const createdDate =
    dateParser.parseDateFromString(createdAt, 'L/dd/yyyy', dateFormat) || '';
  const updatedAt = report.updated_at || '';
  const updatedDate =
    dateParser.parseDateFromString(updatedAt, 'L/dd/yyyy', dateFormat) || '';

  return {
    id: report.permalink,
    reportUpgraded: report.report_upgraded,
    createdAt,
    createdDate,
    updatedAt,
    updatedDate,
    alertMe: report.alert_me || null,
    hasNewInfo: report.has_new_info || null,
    reportType: report.report_type,
    details: {
      ...report,
      network: usernameParts[1],
    },
    detailsCityState: `${report.city || ''}${
      report.city && report.state ? ', ' : ''
    }${report.state || ''}`,
    reportData: RecentReportData(report),
    reportTypeFormatted: ReportTypes[report.report_type] || '',
  };
}

function RecentReportData(report: RecentReportRawData) {
  const phoneNumber = report.phone_number || '';
  const nameInfo = `${report.first_name} ${report.last_name}${
    report.age ? `, ${report.age}` : ''
  }`;
  const reportData = {
    social_network_report: report.email,
    detailed_person_report: nameize(nameInfo),
    username_report: report.username,
    reverse_phone_report: formatPhone(phoneNumber),
    sex_offender_report: report.address,
    property_report: report.address,
    detailed_business_report: report.domain,
  };

  return reportData[report.report_type] || '';
}
