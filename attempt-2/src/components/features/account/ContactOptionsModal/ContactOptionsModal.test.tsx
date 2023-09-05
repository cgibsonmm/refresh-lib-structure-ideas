import { render } from '@testing-library/react';
import { withProviders } from '@/utils/TestUtils';
import { ContactOptionsModal } from './ContactOptionsModal';

import 'jest-styled-components';

describe('ContactOptionsModal', () => {
  it('matches the snapshot', () => {
    // Use 'baseElement' because MUI renders the Dialog in a portal
    const { baseElement } = render(
      withProviders(() => (
        <ContactOptionsModal
          isOpen={true}
          setIsOpen={() => {
            return null;
          }}
          onCloseHandle={() => {
            return null;
          }}
          openConfirmCancelModal={() => {
            return null;
          }}
        />
      ))
    );

    expect(baseElement).toMatchSnapshot();
  });
});
