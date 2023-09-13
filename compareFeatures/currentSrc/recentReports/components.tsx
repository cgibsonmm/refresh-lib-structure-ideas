import { useMediaQuery, useTheme } from '@mui/material';
import {
  Text,
  Stack,
  Box,
  Button,
  Select,
  SelectOption,
  Grid,
  Icons,
  styled,
} from '@/theme/index';
import { ValidReportTypes } from '@/utils/helperTypes';
import { RecentReportSerialized } from './Interfaces';
import { RecentReportsCard } from '../components';

export function ReportList({
  reportList,
  editReportsMode,
}: {
  reportList: RecentReportSerialized[];
  editReportsMode: boolean;
}) {
  return (
    <Grid marginTop={2.5}>
      {reportList.length >= 1
        ? reportList.map((report, index) => {
            return (
              <RecentReportsCard
                reportPermaLink={report.id}
                reportTitle={report.reportData}
                detailsCityState={report.detailsCityState}
                reportType={report.reportTypeFormatted as ValidReportTypes}
                createdDate={report.createdDate}
                updatedDate={report.updatedDate}
                key={index}
                editReportsMode={editReportsMode}
                alertMe={report.alertMe}
              />
            );
          })
        : 'No previously run reports were found'}
    </Grid>
  );
}

export const TextWithIcon = styled(Text)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',

  svg: {
    marginRight: theme.spacing(1),
  },
}));

type ReportFilterProps = {
  /** The options to display in the filter dropdown. */
  filterOptions: SelectOption[];
  /** Callback fired when the user selects a filter option. */
  onFilterSelect: (filter: string) => void;
  editReportsMode: boolean;
  setEditReportsMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReportTypeFilter = ({
  filterOptions,
  onFilterSelect,
  editReportsMode,
  setEditReportsMode,
}: ReportFilterProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack direction={isMobile ? 'column' : 'row'}>
      <Box sx={{ width: isMobile ? '100%' : '30%' }}>
        <TextWithIcon variant="body2">
          <Icons.Tune color="primary" fontSize="small" /> Filter by report type
        </TextWithIcon>
        <Select
          options={filterOptions}
          onOptionSelect={onFilterSelect}
          id={'reports-filter'}
          data-cy="recent_reports_filter"
        />
      </Box>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignSelf="flex-end"
        sx={(theme) => ({
          width: isMobile ? '100%' : '50%',
          marginLeft: 'auto',
          marginTop: theme.spacing(1),
        })}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setEditReportsMode(!editReportsMode);
          }}
          fullWidth={isMobile}
        >
          {editReportsMode ? (
            'Cancel'
          ) : (
            <>
              <Icons.Edit /> Edit reports
            </>
          )}
        </Button>
      </Stack>
    </Stack>
  );
};
