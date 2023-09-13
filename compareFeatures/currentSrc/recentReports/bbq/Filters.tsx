import CheckIcon from '@mui/icons-material/Check';
import {
  TextField,
  Autocomplete,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useContext, SyntheticEvent } from 'react';
import { AppConfig } from '@/context/AppConfig';
import { ReportType, ReportTypeOption } from './types';

type Props = {
  reportTypeOptions: { [key: string]: ReportTypeOption };
  reportTypes: ReportType[];
  setReportTypes: (reportTypes: ReportType[]) => void;
};

export const Filters = ({
  reportTypeOptions,
  reportTypes,
  setReportTypes,
}: Props) => {
  const { trackEvent } = useContext(AppConfig);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme.breakpoints.down('lg'));
  const collapseFilterOptions = isSmall || (!isMedium && isLarge);

  const options = Object.values(reportTypeOptions) as ReportTypeOption[];
  const selectedOptions = options.filter((reportTypeOption) =>
    reportTypes.includes(reportTypeOption.id)
  );

  const handleChange = (event: SyntheticEvent, values: ReportTypeOption[]) => {
    setReportTypes(values.map((reportTypeOption) => reportTypeOption.id));
    values.forEach((reportTypeOption) =>
      trackEvent('recent reports', 'click', reportTypeOption.eventLabel)
    );
  };

  return (
    <Autocomplete
      sx={{
        minWidth: '285px',
        maxWidth: collapseFilterOptions ? null : '375px',
      }}
      multiple
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      getOptionLabel={(option) => option.display}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Filter by"
          placeholder={
            selectedOptions.length === 0 ? 'Select a report type...' : ''
          }
        />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option.id}
          value={option.id}
          sx={{ justifyContent: 'space-between' }}
        >
          {option.display}
          {selected && <CheckIcon color="info" />}
        </MenuItem>
      )}
    />
  );
};
