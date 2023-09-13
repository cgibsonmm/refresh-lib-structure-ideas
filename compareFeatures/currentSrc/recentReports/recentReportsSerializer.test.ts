import { RawRecentReportsData } from '@/mocks/RawRecentReportsData';
import {
  RecentReportsSerializer,
  RecentReportSerializer,
} from './recentReportsSerializer';

test('it serializes all reports', () => {
  const serializedRecentReportsData = RecentReportsSerializer({
    data: RawRecentReportsData,
  });
  expect(serializedRecentReportsData.polling).toMatchObject(
    RawRecentReportsData.polling
  );
  expect(serializedRecentReportsData.meta).toMatchObject(
    RawRecentReportsData.meta
  );
  expect(serializedRecentReportsData.reports.length).toEqual(
    RawRecentReportsData.reports.length
  );
});

test('it serializes report data', () => {
  const rawReport = RawRecentReportsData.reports[0];
  const serializedRecentReportData = RecentReportSerializer(rawReport);
  expect(serializedRecentReportData.id).toEqual(rawReport.permalink);
  expect(serializedRecentReportData.createdAt).toEqual(rawReport.created_at);
  expect(serializedRecentReportData.updatedAt).toEqual(rawReport.updated_at);
  expect(serializedRecentReportData.alertMe).toEqual(rawReport.alert_me);
  expect(serializedRecentReportData.hasNewInfo).toBe(true);
  expect(serializedRecentReportData.reportType).toEqual(rawReport.report_type);
  expect(serializedRecentReportData.reportData).toEqual('Shawn Siegel, 40');
  expect(serializedRecentReportData.reportTypeFormatted).toEqual('Person');
});
