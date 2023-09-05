import React from 'react';
import { Box, Text } from '@/theme/components';
import { LimitReached } from './LimitReached/LimitReached';
import { PlanCard } from './PlanCard/PlanCard';
import {
  CustomSolutionButton,
  CustomSolutionContainer,
  CustomSolutionDescription,
  CustomSolutionHeading,
  Heading,
  PlansContainer,
  SubHeading,
  SubscriptionDescription,
} from './components';

export interface CurrentPlan {
  /** Plan name to show to the user. */
  title: string;
  /** Plan monthly limit. */
  limit: number | 'unlimited';
  /**
   * Monthly cost per report for the current plan. Use the `costPerReport` util to get this value since there are
   * important rounding considerations to generate the correct value.
   */
  costPerReport?: number;
  /** Indicates if the subscription is canceled. */
  canceled?: boolean;
}

export interface Plan {
  /** Plan unique key */
  key: string;
  title: string;
  description: string;
  /** Plan monthly cost */
  amount: number;
  /** Plan monthly limit, -1 for unlimited plans  */
  limit: number;
  /** Renewal period expressed in months */
  renewalPeriod: number;
  /** Monthly cost per report. Use the costPerReport util to calculate this. */
  costPerReport?: number;
  /** Indicates if this is the most popular plan */
  mostPopular?: boolean;
  /** Savings percentage vs current subscription. Use the savings util to calculate this. */
  savings?: number;
}

export interface UpgradePlanProps {
  /** Information about the current plan. */
  currentPlan: CurrentPlan;
  /** List of plans available for the user to upgrade to. */
  plans: Plan[];
  /** Callback fired when the user selects a plan from the list. */
  onSelectPlan: (plan: Plan) => void;
  /** Callback fired when the user clicks the Contact Us button. */
  onContactUs: () => void;
}

/**
 * This component is responsible for providing users with the ability to upgrade their plan.
 * It displays basic current plan information and also a list of plans available for the user to upgrade to.
 * It also provides ways for the user to **Contact Us** if they need a customized solution and show the user
 * once they have reached their limit when they are in the highest plan available.
 */
export function UpgradePlan({
  currentPlan: { title, limit, costPerReport = 0, canceled = false },
  plans,
  onSelectPlan,
  onContactUs,
}: UpgradePlanProps) {
  const noPlans = plans.length === 0;

  if (noPlans) {
    return <LimitReached onContactUs={onContactUs} />;
  }

  const subscriptionCostPerReport: string | JSX.Element =
    limit !== 'unlimited' && costPerReport > 0
      ? `($${costPerReport.toFixed(2)} per report)`
      : '';

  let subscriptionDescription: string | JSX.Element;

  if (canceled) {
    subscriptionDescription = 'Subscribe to run more reports today';
  } else {
    subscriptionDescription = (
      <>
        Your current plan is{' '}
        <Text
          component="span"
          sx={(theme) => ({
            color: theme.palette.primary.main,
            fontSize: 'inherit',
          })}
        >
          {title}
        </Text>{' '}
        and includes{' '}
        <Text
          component="span"
          sx={(theme) => ({
            color: theme.palette.primary.main,
            fontSize: 'inherit',
          })}
        >
          {limit} report credits {subscriptionCostPerReport}
        </Text>
      </>
    );
  }

  return (
    <Box>
      <Box sx={{ paddingInline: 'clamp(20px, 10vw, 150px)' }}>
        <Heading component="h1" variant="h1">
          Unlock more reports and lower your cost per report
        </Heading>
        <SubHeading variant="h2">
          Select a new plan and expand your search capabilities
        </SubHeading>
        <SubscriptionDescription>
          {subscriptionDescription}
        </SubscriptionDescription>
      </Box>

      <PlansContainer>
        {plans.map((plan) => (
          <PlanCard
            key={plan.key}
            heading={plan.title}
            subheading={plan.description}
            limit={plan.limit}
            cost={plan.amount}
            renewalPeriod={plan.renewalPeriod}
            costPerReport={plan.costPerReport}
            mostPopular={plan.mostPopular}
            savings={plan.savings}
            hoverCard={true}
            onClick={() => onSelectPlan(plan)}
          />
        ))}
      </PlansContainer>

      <CustomSolutionContainer>
        <Box>
          <CustomSolutionHeading>
            Need a customized solution?
          </CustomSolutionHeading>
          <CustomSolutionDescription>
            Still want more?
          </CustomSolutionDescription>
          <CustomSolutionDescription>
            Get a customized plan for your needs!
          </CustomSolutionDescription>
        </Box>
        <CustomSolutionButton
          variant="contained"
          color="success"
          size="large"
          onClick={onContactUs}
        >
          Contact us now
        </CustomSolutionButton>
      </CustomSolutionContainer>
    </Box>
  );
}
