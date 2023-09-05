import { Checkbox, styled } from '@/theme/index';

export const ReactivationContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2.5),
  paddingTop: theme.spacing(4),
}));

export const ComponentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  width: '-webkit-fill-available',
  gap: theme.spacing(1.5),
  maxWidth: '618px',
  margin: 'auto',
}));

export const CardRow = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  '& > div': {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const PlanRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
}));

export const DescriptionRow = styled('div')(() => ({
  width: '100%',
}));

export const CardImage = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export const PlansContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(3),
}));

export const PlanCardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(4),
  border: `1px solid ${theme.palette.grey[300]}`,
  marginBottom: theme.spacing(2),
}));

export const PlanCheckbox = styled(Checkbox)(({ theme }) => ({
  alignSelf: 'baseline',
  padding: 0,
  marginRight: theme.spacing(2),
}));

export const Left = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

export const Right = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginLeft: 'auto',
}));

export const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
  width: '-webkit-fill-available',

  [theme.breakpoints.up('sm')]: {
    alignItems: 'center',
  },
}));
