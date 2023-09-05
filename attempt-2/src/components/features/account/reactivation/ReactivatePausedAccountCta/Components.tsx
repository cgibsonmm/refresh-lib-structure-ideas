import { styled } from '@/theme/index';

export const Bar = styled('div')(({ theme }) => ({
  borderRadius: '4px',
  padding: theme.spacing(1),

  marginBottom: theme.spacing(1),
  width: '100%',
  height: '67px',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
}));

export const BarTitle = styled('div')(({ theme }) => ({
  fontSize: '36px',
  marginRight: theme.spacing(1),
}));

export const BarContent = styled('div')(() => ({
  maxWidth: '125px',
  textAlign: 'left',
}));
