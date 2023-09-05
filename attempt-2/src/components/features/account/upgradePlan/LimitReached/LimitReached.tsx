import React, { useContext } from 'react';
import { AppConstants } from '@/context/AppConstants';
import { Box } from '@/theme/index';
import {
  LimitReachedContainer,
  LimitReachedDescription,
  LimitReachedHeader,
  LimitReachedImageContainer,
} from './components';
import { CustomSolutionButton, Heading, SubHeading } from '../components';

export interface LimitReachedProps {
  /** Callback fired when the user clicks the **Contact us now** button. */
  onContactUs: () => void;
}

/**
 * This component is used to display the limit reached message in the upgrade plan flow.
 * This happens when the user has already upgraded to the highest plan available and we don't
 * have any more plans to offer.
 */
export function LimitReached({ onContactUs }: LimitReachedProps) {
  const { imgComputerLimitReached } = useContext(AppConstants);

  return (
    <LimitReachedContainer className="limit-reached">
      <Box>
        <LimitReachedDescription>
          <LimitReachedHeader>
            <Heading component="p" variant="h1">
              Power through your limit?
            </Heading>

            <Heading component="p" variant="h1" sx={{ fontWeight: 'bold' }}>
              Reach out to keep the momentum going!
            </Heading>
          </LimitReachedHeader>

          <SubHeading variant="h2">
            We offer customized solutions to match your needs
          </SubHeading>

          <CustomSolutionButton
            variant="contained"
            color="success"
            size="large"
            onClick={onContactUs}
          >
            Contact us now
          </CustomSolutionButton>
        </LimitReachedDescription>
      </Box>

      <LimitReachedImageContainer>
        <img src={imgComputerLimitReached} alt="Limit reached" />
      </LimitReachedImageContainer>
    </LimitReachedContainer>
  );
}
