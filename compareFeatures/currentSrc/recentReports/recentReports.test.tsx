import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RawRecentReportsData } from '@/mocks/RawRecentReportsData';
import {
  getLizanoListHandler,
  getLizanoNotesHandler,
  getPaymentMethodsHandler,
} from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { BrandThemeProvider } from '@/theme/index';
import 'jest-styled-components';
import { ReportTypeFilter } from './components';
import { RecentReports } from './recentReports';
import { RecentReportsSerializer } from './recentReportsSerializer';

const reportsSerializedData = RecentReportsSerializer({
  data: RawRecentReportsData,
});
const data = {
  filterOptions: [
    { value: 'all', display: 'All' },
    { value: 'detailed_person_report', display: 'Person' },
    { value: 'property_report', display: 'Property' },
    { value: 'social_network_report', display: 'Email' },
    { value: 'reverse_phone_report', display: 'Phone' },
    { value: 'sex_offender_report', display: 'Neighborhood' },
    { value: 'username_report', display: 'Username' },
    { value: 'vehicle_report', display: 'Vehicle' },
  ],
  onFilterSelect: () => {
    return 1;
  },
  monitorCount: 10,
  reportList: reportsSerializedData.reports,
  editReportsMode: false,
  setEditReportsMode: () => {
    return;
  },
};

beforeEach(() => {
  server.use(
    getLizanoNotesHandler,
    getLizanoListHandler,
    getPaymentMethodsHandler
  );
});

test('Recent reports renders with the correct content', () => {
  render(
    <BrandThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <RecentReports
          monitorCount={data.monitorCount}
          reportList={data.reportList}
          editReportsMode={data.editReportsMode}
          FilterComponent={
            <ReportTypeFilter
              filterOptions={data.filterOptions}
              onFilterSelect={data.onFilterSelect}
              editReportsMode={data.editReportsMode}
              setEditReportsMode={data.setEditReportsMode}
            />
          }
        />
      </QueryClientProvider>
    </BrandThemeProvider>
  );

  expect(screen.getByText('Recent Reports')).toBeInTheDocument();
  expect(
    screen.getByText('You have 10 monitors available')
  ).toBeInTheDocument();
  expect(screen.getByText('Filter by report type')).toBeInTheDocument();
});

test('Recent reports shows loading state', () => {
  render(
    <BrandThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <RecentReports
          monitorCount={data.monitorCount}
          reportList={data.reportList}
          editReportsMode={data.editReportsMode}
          FilterComponent={
            <ReportTypeFilter
              filterOptions={data.filterOptions}
              onFilterSelect={data.onFilterSelect}
              editReportsMode={data.editReportsMode}
              setEditReportsMode={data.setEditReportsMode}
            />
          }
          isLoading
        />
      </QueryClientProvider>
    </BrandThemeProvider>
  );

  const skeleton = screen.getByRole('status');
  expect(skeleton).toBeInTheDocument();
});

test('Recent reports renders the correct content', () => {
  const { asFragment } = render(
    <BrandThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <RecentReports
          monitorCount={data.monitorCount}
          reportList={data.reportList}
          editReportsMode={data.editReportsMode}
          FilterComponent={
            <ReportTypeFilter
              filterOptions={data.filterOptions}
              onFilterSelect={data.onFilterSelect}
              editReportsMode={data.editReportsMode}
              setEditReportsMode={data.setEditReportsMode}
            />
          }
        />
      </QueryClientProvider>
    </BrandThemeProvider>
  );
  expect(asFragment()).toMatchSnapshot();
});
