import CheckIcon from '@mui/icons-material/Check';
import { TextField, Autocomplete, MenuItem } from '@mui/material';
import { SyntheticEvent } from 'react';
import { SortBy, SortDirection } from './types';

const sortDirectionMap = {
  value: {
    desc: 'Descending',
    asc: 'Ascending',
  },
  eventLabel: {
    desc: 'Newest to oldest',
    asc: 'Oldest to newest',
  },
};

const sortByMap = {
  value: {
    last_viewed_at: 'Date Viewed',
    updated_at: 'Date Updated',
    created_at: 'Date Created',
  },
  eventLabel: {
    last_viewed_at: 'Viewed On',
    updated_at: 'Updated On',
    created_at: 'Created On',
  },
};

type SortOption = {
  key: string;
  display: string;
  sort_by: SortBy;
  sort_direction: SortDirection;
};

type SortQueryParams = {
  sort_by: SortBy;
  sort_direction: SortDirection;
};

const sortKey = ({ sort_by, sort_direction }: SortQueryParams) =>
  `${sort_by}-${sort_direction}`;

const sortDisplay = ({ sort_by, sort_direction }: SortQueryParams) => {
  const sortByDisplay = sortByMap.value[sort_by];
  const sortDirectionDisplay = sortDirectionMap.value[sort_direction];

  return `${sortByDisplay} (${sortDirectionDisplay})`;
};

const generateSortOption = ({
  sort_by,
  sort_direction,
}: SortQueryParams): SortOption => {
  const key = sortKey({ sort_by, sort_direction });
  const display = sortDisplay({ sort_by, sort_direction });

  return { key, display, sort_by, sort_direction };
};

const options: SortOption[] = (
  Object.keys(sortByMap.value) as SortBy[]
).flatMap((sort_by) =>
  (Object.keys(sortDirectionMap.value) as SortDirection[]).map(
    (sort_direction) => generateSortOption({ sort_by, sort_direction })
  )
);

type Props = {
  currentSort: SortQueryParams;
  setQueryParams: (queryParams: SortQueryParams) => void;
};

export const Sort = ({ currentSort, setQueryParams }: Props) => {
  const handleChange = (
    event: SyntheticEvent,
    sortOption: SortOption | null
  ) => {
    if (sortOption !== null) {
      const { sort_by, sort_direction } = sortOption;
      setQueryParams({ sort_by, sort_direction });
    } else {
      setQueryParams({ sort_by: 'last_viewed_at', sort_direction: 'desc' });
    }
  };

  const currentOption = generateSortOption(currentSort);

  return (
    <Autocomplete
      sx={{ minWidth: '285px' }}
      options={options}
      value={currentOption}
      isOptionEqualToValue={(option) => option.key === currentOption.key}
      onChange={handleChange}
      getOptionLabel={(option) => option.display}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Sort by" />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option.key}
          value={option.key}
          sx={{ justifyContent: 'space-between' }}
        >
          {option.display}
          {selected && <CheckIcon color="info" />}
        </MenuItem>
      )}
    />
  );
};
