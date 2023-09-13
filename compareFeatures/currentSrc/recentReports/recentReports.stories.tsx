import { StoryObj, Meta } from '@storybook/react';
import { rest } from 'msw';
import { fetchAccountMock } from '@/account/account.mock';
import { RawRecentReportsData } from '@/mocks/RawRecentReportsData';
import { accountListsResponse } from '@/mocks/accountLists';
import { accountNotesResponse } from '@/mocks/accountNotes';
import { paymentMethodsResponse } from '@/mocks/paymentMethods';
import { ReportTypeFilter } from './components';
import { RecentReports } from './recentReports';
import { RecentReportsSerializer } from './recentReportsSerializer';

const reports = RecentReportsSerializer({ data: RawRecentReportsData });

const filterArgs = {
  filterOptionsOne: [
    { value: 'all', display: 'All' },
    { value: 'detailed_person_report', display: 'Person' },
    { value: 'property_report', display: 'Property' },
    { value: 'social_network_report', display: 'Email' },
    { value: 'reverse_phone_report', display: 'Phone' },
    { value: 'username_report', display: 'Username' },
    { value: 'sex_offender_report', display: 'Neighborhood' },
    { value: 'vehicle_report', display: 'Vehicle' },
  ],
  filterOptionsTwo: [
    { value: 'all', display: 'All' },
    { value: 'detailed_person_report', display: 'Person' },
    { value: 'property_report', display: 'Property' },
    { value: 'social_network_report', display: 'Email' },
    { value: 'reverse_phone_report', display: 'Phone' },
    { value: 'username_report', display: 'Username' },
  ],
  onFilterSelect: () => {
    return;
  },
  editReportsMode: false,
  setEditReportsMode: () => {
    return;
  },
};

const meta: Meta<typeof RecentReports> = {
  title: 'Features/Recent Reports',
  component: RecentReports,
  parameters: {
    sessionProvider: true,
    msw: {
      handlers: [
        rest.get('/api/v5/account', (req, res, ctx) => {
          return res(ctx.json(fetchAccountMock));
        }),
        rest.get('/api/v5/lizano/lists', (req, res, ctx) => {
          return res(ctx.json(accountListsResponse));
        }),
        rest.get('/api/v5/payment_methods', (req, res, ctx) => {
          return res(ctx.json(paymentMethodsResponse));
        }),
        rest.get('/api/v5/lizano/notes', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(accountNotesResponse));
        }),
      ],
    },
  },
  argTypes: {
    FilterComponent: {
      control: {
        type: 'select',
        options: ['FilterComponent1', 'FilterComponent2'],
      },
      mapping: {
        FilterComponent1: (
          <ReportTypeFilter
            filterOptions={filterArgs.filterOptionsOne}
            onFilterSelect={filterArgs.onFilterSelect}
            editReportsMode={filterArgs.editReportsMode}
            setEditReportsMode={filterArgs.setEditReportsMode}
          />
        ),
        FilterComponent2: (
          <ReportTypeFilter
            filterOptions={filterArgs.filterOptionsTwo}
            onFilterSelect={filterArgs.onFilterSelect}
            editReportsMode={filterArgs.editReportsMode}
            setEditReportsMode={filterArgs.setEditReportsMode}
          />
        ),
      },
    },
  },
  args: {
    monitorCount: 10,
    reportList: reports.reports,
    editReportsMode: false,
  },
};

export default meta;

type Story = StoryObj<typeof RecentReports>;

export const Default: Story = {};
