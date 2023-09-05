import { yellow } from '@mui/material/colors';
import { Box, Pill, styled, Text } from '@/theme/index';

export const PlanCardContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '350px',
  padding: theme.spacing(2.5, 2),
  overflow: 'inherit',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: '5px',
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.up('sm')]: {
    width: 240,
  },

  [theme.breakpoints.up('md')]: {
    width: 275,
    padding: theme.spacing(3),
  },

  '&.hover-card': {
    transition: '0.1s ease',
    transformStyle: 'preserve-3d',

    '::after': {
      content: '""',
      position: 'absolute',
      top: 5,
      right: 0,
      width: '95%',
      height: '100%',
      backgroundColor: theme.palette.grey[200],
      borderRadius: 5,
      transform: 'translateZ(-1px)',
      transition: '0.1s ease',
    },

    ':hover': {
      transform: 'translateY(-1%)',

      '::after': {
        transform: 'translate3d(1%, 1%, -1px) ',
        backgroundColor: theme.palette.grey[300],
      },
    },
  },

  '&.most-popular': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

export const MostPopular = styled(Pill)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  paddingInline: theme.spacing(2),
  borderRadius: 5,
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  fontSize: 12,
  fontWeight: 'bold',
  transform: 'translate(-50%, -50%)',
}));

export const Savings = styled(Pill)(({ theme }) => ({
  width: 'fit-content',
  backgroundColor: yellow.A700,
  color: theme.palette.text.primary,
  fontSize: 12,
  fontWeight: 'bold',
}));

export const Heading = styled(Text)(({ theme }) => ({
  margin: 0,
  fontSize: 30,
  lineHeight: '36px',
  color: theme.palette.primary.main,
}));

export const SubHeading = styled(Text)(({ theme }) => ({
  lineHeight: 1.2,
  minHeight: theme.spacing(5),
  color: theme.palette.text.secondary,
}));

export const MoLimitLabel = styled(Text<'span'>)(({ theme }) => ({
  marginLeft: '6px',
  fontSize: '14px',
  fontWeight: 'bold',
  lineHeight: '17px',
  color: theme.palette.text.secondary,
}));

export const SavingsPerReportContainer = styled(Text)(({ theme }) => ({
  fontSize: 14,
  lineHeight: '22px',
  color: theme.palette.primary.main,
}));
