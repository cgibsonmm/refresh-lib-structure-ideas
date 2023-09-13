import {
  Text,
  Icons,
  Skeleton,
  Stack,
  Box,
  LoadingReportCard,
} from '@/theme/index';
import { RecentReportSerialized } from './Interfaces';
import { ReportList, TextWithIcon } from './components';

type RecentReportsProps = {
  /** The number of monitors available to the user. */
  monitorCount: number;
  reportList: RecentReportSerialized[];
  /** If true, the component is in loading state. */
  isLoading?: boolean;
  editReportsMode: boolean;
  FilterComponent: JSX.Element;
};

function LoadingReports() {
  return (
    <>
      <Skeleton
        variant="rounded"
        width={228}
        height={36}
        sx={{ mb: 1.5 }}
        role="status"
      />
      <Skeleton variant="rounded" width={159} height={19} sx={{ mb: 2.5 }} />
      <Skeleton variant="rounded" width={159} height={19} sx={{ mb: 1 }} />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        mb={3.5}
      >
        <Skeleton
          variant="rounded"
          sx={{ width: { xs: '100%', md: 251 }, mb: { xs: 2.5, md: 0 } }}
          height={43}
        />
        <Skeleton
          variant="rounded"
          sx={{ width: { xs: '100%', md: 137 } }}
          height={43}
        />
      </Stack>
      <LoadingReportCard />
      <LoadingReportCard />
      <LoadingReportCard />
    </>
  );
}

export const RecentReports = ({
  isLoading,
  monitorCount,
  reportList,
  editReportsMode,
  FilterComponent,
}: RecentReportsProps) => (
  <Box>
    <TextWithIcon variant="h1">
      <Icons.Restore color="primary" fontSize="large" /> Recent Reports
    </TextWithIcon>
    <Text>You have {monitorCount || 0} monitors available</Text>
    {FilterComponent}
    {isLoading ? (
      <LoadingReports />
    ) : (
      <ReportList reportList={reportList} editReportsMode={editReportsMode} />
    )}
  </Box>
);
