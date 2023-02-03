import Head from 'next/head';
import { Box, Container } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { pages } from '../constants';
import LinkButton from '../components/linkButton';
import { useAuthContext } from '../contexts/auth-context';

const linkButtonSize = {
  width: 1 / 4,
  fontSize: 30,
};

const Page = () => {
  const {authAxios, userId, isAuthenticated} = useAuthContext();

  return (
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
          <div className='button-box'>
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
            <LinkButton
              href={isAuthenticated ? pages.market.url + `?owner=${userId}` : pages.loginPage.url}
              sx={{
                backgroundColor: "#8860D0",
                ...linkButtonSize,
              }}
            >
                    Your Listings
            </LinkButton>
          </div>
        </div>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout noGuard={true}>
    {page}
  </DashboardLayout>
);

export default Page;
