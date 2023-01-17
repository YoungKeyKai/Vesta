import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthGuard } from './auth-guard';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const DashboardLayout = (props) => {
  const { children, noGuard } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const dashboard = (
    <div>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </div>
  )

  if (noGuard) {
    return dashboard;
  }

  return (
    <AuthGuard>
      {dashboard}
    </AuthGuard>
  );
};

DashboardLayout.propTypes = {
  noGuard: PropTypes.bool
};

DashboardLayout.defaultProps = {
  noGuard: false
}
