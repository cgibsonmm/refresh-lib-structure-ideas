import { Box, styled } from '@/theme/index';

export const LimitReachedContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',

  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },
}));

export const LimitReachedDescription = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),

  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },

  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(7),
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
  },

  [theme.breakpoints.up('lg')]: {
    paddingTop: theme.spacing(11),
    paddingLeft: theme.spacing(10),
  },
}));

export const LimitReachedHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up('md')]: {
    width: 614,
  },
}));

export const LimitReachedImageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 370,
  alignSelf: 'end',
  overflow: 'hidden',

  [theme.breakpoints.up(410)]: {
    maxWidth: 400,
  },

  [theme.breakpoints.up(768)]: {
    maxWidth: 750,
  },

  [theme.breakpoints.up('lg')]: {
    maxWidth: 860,
  },

  '& img': {
    objectFit: 'cover',
    width: 550,

    [theme.breakpoints.up(768)]: {
      width: 1000,
      height: 520,
    },

    [theme.breakpoints.up('lg')]: {
      width: 'auto',
      height: 'auto',
    },
  },
}));
