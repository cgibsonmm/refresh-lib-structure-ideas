import { Box, Button, styled, Text } from '@/theme/index';

export const PlansContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(3),

  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
  },
}));

export const Heading = styled(Text<'h1' | 'p'>)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: 'clamp(25px, 5vw, 55px)',
  fontWeight: 500,
  lineHeight: 'clamp(30px, 6vw, 55px)',
}));

export const SubHeading = styled(Text)(({ theme }) => ({
  marginBottom: 'clamp(30px, 5vw, 60px)',
  color: theme.palette.text.secondary,
  fontSize: 'clamp(15px, 3vw, 27px)',
  lineHeight: 'clamp(18px, 4vw, 33px)',
}));

export const SubscriptionDescription = styled(Text)(({ theme }) => ({
  marginBottom: 'clamp(20px, 2.5vw, 40px)',
  color: theme.palette.grey[500],
  fontSize: 'clamp(14px, 2.5vw, 22px)',
  lineHeight: 'clamp(17px, 3vw, 27px)',
}));

export const CustomSolutionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 350,
  padding: theme.spacing(2),
  marginInline: 'auto',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: 5,

  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    maxWidth: 564,
    flexDirection: 'row',
  },
}));

export const CustomSolutionHeading = styled(Text)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontSize: 24,
  fontWeight: 500,
  lineHeight: '30px',
  letterSpacing: 0,
  color: theme.palette.primary.main,
}));

export const CustomSolutionDescription = styled(Text)(({ theme }) => ({
  fontSize: 'clamp(14px, 2vw, 16px)',
  fontWeight: 600,
  lineHeight: 'clamp(17px, 2.5vw, 20px)',
  color: theme.palette.text.secondary,
}));

export const CustomSolutionButton = styled(Button)(({ theme }) => ({
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));
