/**
 * Calculates the cost per month for a plan
 *
 * @param cost Cost of the plan
 * @param renewalPeriod Number of months the plan is valid for
 * @returns Cost per month
 */
export function monthlyPlanCost(cost: number, renewalPeriod: number): number {
  return cost / renewalPeriod;
}

/**
 * Calculates the monthly cost per report for a plan
 *
 * @param cost Cost of the plan
 * @param renewalPeriod Number of months the plan is valid for
 * @param limit Monthly report limit of the plan
 * @returns Cost per report rounded to the nearest hundredth
 */
export function costPerReport(
  cost: number,
  renewalPeriod: number,
  limit: number
): number {
  const mthlyPlanCost = Math.ceil(monthlyPlanCost(cost, renewalPeriod));

  // Do not change, the rounding used here is important and was agreed with the product team
  //round to hundredths
  const costPerReport = Math.ceil((mthlyPlanCost / limit) * 100) / 100;

  return costPerReport;
}

/**
 * Calculates the savings based on the monthly cost per report of upgrading from a base plan to a new plan
 *
 * @param baseCost Cost of the base plan
 * @param baseRenewalPeriod Number of months the base plan is valid for
 * @param baseLimit Monthly report limit of the base plan
 * @param upgradeCost Cost of the upgrade plan
 * @param upgradeRenewalPeriod Number of months the new plan is valid for
 * @param upgradeLimit Monthly report limit of the upgrade plan
 * @returns Savings as a percentage
 */
export function savings(
  baseCost: number,
  baseRenewalPeriod: number,
  baseLimit: number,
  upgradeCost: number,
  upgradeRenewalPeriod: number,
  upgradeLimit: number
): number {
  const baseCostPerReport = costPerReport(
    baseCost,
    baseRenewalPeriod,
    baseLimit
  );
  const upgradeCostPerReport = costPerReport(
    upgradeCost,
    upgradeRenewalPeriod,
    upgradeLimit
  );

  // Do not change, the rounding used here is important and was agreed with the product team
  const savings = Math.floor(
    ((baseCostPerReport - upgradeCostPerReport) / baseCostPerReport) * 100
  );

  return savings;
}
