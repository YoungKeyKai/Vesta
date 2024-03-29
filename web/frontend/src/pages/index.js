import Head from 'next/head';
import { Box, Container } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { pages } from '../constants';
import LinkButton from '../components/linkButton';

const linkButtonSize = {
  padding: '2rem',
  width: 1 / 4,
  fontSize: 30,
};

const Page = () => (
  <>
    <Head>
      <title>
        Home | Vesta
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <div className='homepage'>
          <h1 className='vesta-main-title'>
                Vesta
          </h1>
          <Box sx={{ fontSize: 26, color: 'text.secondary' }}>
            The
            <Box sx={{ display: 'inline', fontSize: 26, fontStyle: 'italic', fontWeight: 'bold', color: 'success.dark' }}>
              {' One-Stop Shop '}
            </Box>
            for your Subleasing Needs
          </Box>
          <Box 
            className='button-box' 
            sx={{ display: 'flex', alignItems: 'center', minHeight: '24rem' }}
          >
            <LinkButton
              href={pages.market.url}
              sx={{
                backgroundColor: "#84CEEB",
                ...linkButtonSize,
              }}
            >
                Find Listings
            </LinkButton>
            <LinkButton
              href={pages.createListingPage.url}
              sx={{
                backgroundColor: "#5AB9EA",
                ...linkButtonSize,
              }}
            >
                Create Listings
            </LinkButton>
          </Box>
        </div>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout noGuard={true}>
    {page}
  </DashboardLayout>
);

export default Page;
