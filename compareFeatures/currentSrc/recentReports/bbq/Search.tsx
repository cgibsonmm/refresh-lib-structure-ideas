import { Input } from '@/theme/index';

type Props = {
  searchBy: string;
  setSearchBy: (searchBy: string) => void;
  cancelDebounceAndUpdate: () => void;
};

export const Search = ({
  searchBy,
  setSearchBy,
  cancelDebounceAndUpdate,
}: Props) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      cancelDebounceAndUpdate();
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchBy(event.target.value);

  return (
    <Input
      variant="outlined"
      label="Search report history"
      fullWidth
      sx={{
        fontSize: '14px',
        '& .MuiInputBase-input': {
          height: '56px',
        },
      }}
      data-testid="bbq-search-input"
      value={searchBy}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};
