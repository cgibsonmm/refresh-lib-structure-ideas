import { useQuery } from 'react-query';
import { throwResponseError } from '@/utils/index';
import { RecentReportRawData, RecentReportsDataSerialized } from './Interfaces';
import { RecentReportsSerializer } from './recentReportsSerializer';

async function fetchReports(page: number, reportType: string) {
  const headers = new Headers({
    'content-type': 'application/x-www-form-urlencoded',
  });

  const reportsResponse = await fetch(
    `/api/v5/reports?page=${page}&report_type=${reportType}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (reportsResponse.status === 200) {
    return reportsResponse.json();
  } else {
    throwResponseError('Error fetching recent reports', reportsResponse);
  }
}

export function useReports(
  reportType?: string,
  page?: number,
  options?: {
    serializer?: (
      rawReports: RecentReportRawData
    ) => RecentReportsDataSerialized;
  }
) {
  return useQuery<RecentReportsDataSerialized, Error>(
    ['reports', page, reportType],
    async () => {
      page = page || 1;
      reportType = reportType || '';
      const rawReports = await fetchReports(page, reportType);

      if (options?.serializer) return options.serializer(rawReports);

      return RecentReportsSerializer({ data: rawReports });
    }
  );
}
