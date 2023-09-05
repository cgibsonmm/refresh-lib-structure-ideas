import { disableReactQueryErrorLogs } from '@/utils/TestUtils';
import { monthlyPlanCost, costPerReport, savings } from './utils';

disableReactQueryErrorLogs();

test('monthlyPlanCost', () => {
  expect(monthlyPlanCost(100, 1)).toBe(100 / 1);
  expect(monthlyPlanCost(100, 3)).toBe(100 / 3);
  expect(monthlyPlanCost(100, 6)).toBe(100 / 6);
  expect(monthlyPlanCost(100, 12)).toBe(100 / 12);
});

test('costPerReport', () => {
  // Real cost per report $0,2689
  expect(costPerReport(26.89, 1, 100)).toBe(0.27);
  // Real cost per report $0,1829
  expect(costPerReport(36.58, 1, 200)).toBe(0.19);
  // Real cost per report $0,159975
  expect(costPerReport(63.99, 1, 400)).toBe(0.16);
  // Real cost per report $0,11429
  expect(costPerReport(114.29, 1, 1000)).toBe(0.12);
});

/** Savings calculation depend on costPerReport and not on raw values */
test('savings', () => {
  // Real savings 31.9821%
  expect(savings(26.89, 1, 100, 36.58, 1, 200)).toBe(29);
  // Real savings 40.5076%
  expect(savings(26.89, 1, 100, 63.99, 1, 400)).toBe(40);
  // Real savings 57.4972%
  expect(savings(26.89, 1, 100, 114.29, 1, 1000)).toBe(55);
});
