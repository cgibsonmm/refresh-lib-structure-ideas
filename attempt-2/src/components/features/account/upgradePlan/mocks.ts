import { Plan, CurrentPlan } from './UpgradePlan';
import { costPerReport, savings } from './utils';

export const basePlanMock: Plan = {
  key: '26_89_1_month_nofree_afill_freshness_limit_100_freepdf_upsell',
  title: 'Starter',
  description: 'Starting small and simple',
  amount: 26.89,
  limit: 100,
  renewalPeriod: 1,
};

export const plansMock: Plan[] = [
  {
    key: '36_58_1_month_nofree_afill_freshness_limit_200_freepdf_upsell',
    title: 'Standard',
    description: 'Double your search capacity',
    amount: 36.58,
    limit: 200,
    renewalPeriod: 1,
    costPerReport: costPerReport(36.58, 1, 200),
    savings: savings(
      basePlanMock.amount,
      basePlanMock.renewalPeriod,
      basePlanMock.limit,
      36.58,
      1,
      200
    ),
  },
  {
    key: '63_99_1_month_nofree_afill_freshness_limit_400_freepdf_upsell',
    title: 'Premium',
    description: 'Your premium reports package',
    amount: 63.99,
    limit: 400,
    renewalPeriod: 1,
    costPerReport: costPerReport(63.99, 1, 400),
    mostPopular: true,
    savings: savings(
      basePlanMock.amount,
      basePlanMock.renewalPeriod,
      basePlanMock.limit,
      63.99,
      1,
      400
    ),
  },
  {
    key: '114_29_1_month_nofree_afill_freshness_limit_1000_freepdf_upsell',
    title: 'Professional',
    description: 'Take your business to the next level',
    amount: 114.29,
    limit: 1000,
    renewalPeriod: 1,
    costPerReport: costPerReport(114.29, 1, 1000),
    savings: savings(
      basePlanMock.amount,
      basePlanMock.renewalPeriod,
      basePlanMock.limit,
      114.29,
      1,
      1000
    ),
  },
];

export const currentPlanMock: CurrentPlan = {
  title: basePlanMock.title,
  limit: basePlanMock.limit,
  costPerReport: costPerReport(
    basePlanMock.amount,
    basePlanMock.renewalPeriod,
    basePlanMock.limit
  ),
};
