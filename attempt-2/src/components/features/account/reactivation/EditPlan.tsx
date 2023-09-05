import { Text, Button } from '@/theme/index';
import { dollarize } from '@/utils/dollarize';
import { EditPlanCard } from './EditPlanCard';
import { ButtonContainer, PlansContainer, Right } from './components';
import { SubscriptionPlan } from '../Interfaces';

export function EditPlan({
  plans,
  selectedPlan,
  handleSelectedPlan,
  handleCancelClick,
  toggleEditPlan,
}: {
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan;
  handleSelectedPlan: (
    selectedPLanInternalName: string,
    selectedPLanMonthlyReportLimit: number
  ) => void;
  toggleEditPlan: () => void;
  handleCancelClick: () => void;
}) {
  return (
    <PlansContainer>
      <Text variant="h2">Select from the plans below:</Text>
      {plans.map((plan) => (
        <EditPlanCard
          plan={plan}
          selectedPlan={selectedPlan}
          handleSelectedPlan={handleSelectedPlan}
          key={plan.title}
        />
      ))}
      <Right>
        <Text variant="h3">Due today</Text>
        <Text variant="h2">{dollarize(selectedPlan?.amount)}</Text>
        <Text variant="body1" color="text.secondary">
          Plus applicable sales tax
        </Text>
      </Right>
      <ButtonContainer>
        <Button
          variant="contained"
          sx={{ marginBottom: '8px' }}
          onClick={toggleEditPlan}
        >
          Select this plan
        </Button>
        <Button onClick={handleCancelClick}>Cancel selection</Button>
      </ButtonContainer>
    </PlansContainer>
  );
}
