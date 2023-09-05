//TokenExComponent
export const months = [
  { value: '01', display: '01 - Jan' },
  { value: '02', display: '02 - Feb' },
  { value: '03', display: '03 - Mar' },
  { value: '04', display: '04 - Apr' },
  { value: '05', display: '05 - May' },
  { value: '06', display: '06 - Jun' },
  { value: '07', display: '07 - Jul' },
  { value: '08', display: '08 - Aug' },
  { value: '09', display: '09 - Sep' },
  { value: '10', display: '10 - Oct' },
  { value: '11', display: '11 - Nov' },
  { value: '12', display: '12 - Dec' },
];

const currentYear = new Date().getFullYear();

export type Year = {
  value: string;
  display: string;
};

export const years: Year[] = [];
for (let i = currentYear; i <= currentYear + 20; i++) {
  years.push({ value: i.toString(), display: i.toString() });
}

const CardExessOptions = {
  americanexpress: 'XXXXX',
  diners: 'XXXX',
};

export const exesForType = (cardType: string) => {
  const cardExes =
    CardExessOptions[cardType.toLowerCase() as keyof typeof CardExessOptions];
  return cardExes || 'XXXXXX';
};

export const isExpirationDateValid = (
  selectedMonth: number,
  selectedYear: number
) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  return (
    selectedYear > currentYear ||
    (selectedYear === currentYear && selectedMonth >= currentMonth)
  );
};

export const inputLabelStyles = {
  '&.focused': {
    maxHeight: 'fit-content',
    background: 'white',
    width: 'fit-content',
    padding: '0px 2px',
    top: '0',
    left: '10px',
  },
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  top: '20px',
  left: '10px',
  width: 'fit-content',
  maxHeight: '100%',
  background: 'transparent',
  padding: '0 2px',
  pointerEvents: 'none',
  transition:
    'top 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, left 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms, height 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
};
