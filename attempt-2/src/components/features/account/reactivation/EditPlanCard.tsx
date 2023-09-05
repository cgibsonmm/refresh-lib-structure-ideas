import { Text } from '@/theme/index';
import { dollarize } from '@/utils/dollarize';
import { Left, PlanCardContainer, PlanCheckbox, Right } from './components';
import { SubscriptionPlan } from '../Interfaces';

export function EditPlanCard({
  plan,
  selectedPlan,
  handleSelectedPlan,
}: {
  /** Current user's plan. */
  plan: SubscriptionPlan;
  /** The plan selected by the user to reactivate. */
  selectedPlan: SubscriptionPlan;
  /** Callback fired when the user selects a plan. */
  handleSelectedPlan: (
    plan_internal_name: string,
    selectedPLanMonthlyReportLimit: number
  ) => void;
}) {
  const { title, subtitle, amount, internal_name, monthly_report_limit } = plan;

  const handleClick = () => {
    handleSelectedPlan(internal_name, monthly_report_limit);
  };

  return (
    <PlanCardContainer
      onClick={handleClick}
      role="button"
      key={plan.internal_name}
    >
      <PlanCheckbox
        checked={selectedPlan.internal_name === plan.internal_name}
      />
      <Left>
        <Text variant="h3">{title}</Text>
        <Text
          variant="body1"
          color="text.secondary"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      </Left>
      <Right>
        <Text variant="h2">{dollarize(amount)}</Text>
        <Text color="text.secondary" sx={{ textAlign: 'right' }}>
          Per month plus
        </Text>
        <Text
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'right' }}
        >
          applicable sales tax
        </Text>
      </Right>
    </PlanCardContainer>
  );
}
