import { Box, Button, Divider, Icons, Text } from '@/theme/index';
import {
  Heading,
  MoLimitLabel,
  MostPopular,
  PlanCardContainer,
  Savings,
  SavingsPerReportContainer,
  SubHeading,
} from './components';

export interface PlanCardProps {
  /** Card heading, usually the plan name. */
  heading: string;
  /** Card subheading, usually the plan description. */
  subheading?: string;
  /** Plan monthly limit, -1 for unlimited plans. */
  limit: number;
  /** Plan cost. */
  cost: number;
  /** Renewal period expressed in months. */
  renewalPeriod: number;
  /**
   * Monthly cost per report for this plan. Use the `costPerReport` util to get this value since there are
   * important rounding considerations to generate the correct value.
   */
  costPerReport?: number;
  /** Flag to indicate if this is the most popular plan for the brand. */
  mostPopular?: boolean;
  /**
   * Savings percentage relative to the current plan comparing the monthly cost per report. Use the `savings` util
   * to get this value since there are important rounding considerations to generate the correct value.
   */
  savings?: number;
  /** Enable the hover card effect. */
  hoverCard?: boolean;
  /** Callback fired when the user clicks the **Upgrade plan** button. */
  onClick: () => void;
}

/**
 * This component is used to display all relevant plan details for a single plan in the upgrade plan flow.
 * It has multiple variants depending on the props passed to it. Some of the variants allow to highlight
 * the most popular plan and/or show the savings percentage relative to the current plan.
 */
export function PlanCard({
  heading,
  subheading,
  limit,
  cost,
  renewalPeriod,
  costPerReport,
  mostPopular,
  savings,
  onClick,
}: PlanCardProps) {
  let cardClasses = 'plan-card';

  // hoverCard css is broken in Safari, so we disable it for now - RS - 2023-05-03
  //if (hoverCard) cardClasses += ' hover-card';

  if (mostPopular) cardClasses += ' most-popular';

  const monthlyPlan = renewalPeriod === 1;
  const unlimitedPlan = limit < 0;
  const hasSavings = !!savings && savings > 0;
  const limitLabel = unlimitedPlan ? 'Unlimited reports' : `${limit} reports`;
  const renewalPeriodLabel = monthlyPlan ? '/mo' : `/${renewalPeriod} mo`;

  return (
    <PlanCardContainer className={cardClasses}>
      {mostPopular && (
        <MostPopular
          label="Most popular"
          size="small"
          icon={<Icons.Star color="inherit" />}
        />
      )}

      {hasSavings ? (
        <Savings label={`${savings}% Savings`} size="small" />
      ) : (
        <Box height={24} />
      )}

      <div>
        <Heading variant="h2">{heading}</Heading>

        {subheading && <SubHeading variant="body2">{subheading}</SubHeading>}
      </div>

      <Text sx={{ fontSize: '30px', lineHeight: '36px' }}>
        <span>{limitLabel}</span>
        <MoLimitLabel component="span">/mo</MoLimitLabel>
      </Text>

      <Divider />

      <div>
        <Text fontSize="18px" lineHeight="22px" color="text.secondary">
          <Text component="span" fontWeight="bold">
            ${cost.toFixed(2)}
          </Text>
          <Text component="span" ml="6px" fontSize="16px" fontWeight="normal">
            {renewalPeriodLabel}
          </Text>
        </Text>

        {!unlimitedPlan && (
          <SavingsPerReportContainer>
            {hasSavings && (
              <Text component="span" fontWeight="bold">
                {savings}% savings,&nbsp;
              </Text>
            )}
            {costPerReport && (
              <span>${costPerReport.toFixed(2)} per report</span>
            )}
          </SavingsPerReportContainer>
        )}
      </div>

      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={onClick}
      >
        Upgrade plan
      </Button>
    </PlanCardContainer>
  );
}
