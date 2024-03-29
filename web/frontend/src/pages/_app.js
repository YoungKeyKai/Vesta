import axios from 'axios';
import { Fragment } from 'react';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from '../contexts/auth-context';
import { UserConsumer, UserProvider } from '../contexts/user-context';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { registerChartJs } from '../utils/register-chart-js';
import { theme } from '../theme';

import '../css/index.css';
import '../css/app.css';
import '../css/homepage.css';
import '../css/market.css';
import '../css/listingsPage.css';
import '../css/createListing.css';
import '../css/editListing.css';
import '../css/chat.css';
import '../css/market-listings-table.css';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_ROOT;
axios.defaults.withCredentials = true;

registerChartJs();

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Vesta
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider>
            <AuthProvider>
              <AuthConsumer>
                {
                  (auth) => (
                    <UserConsumer>
                      {
                        () => auth.isLoading
                          ? <Fragment />
                          : getLayout(<Component {...pageProps} />)
                      }
                    </UserConsumer>
                  )
                }
              </AuthConsumer>
            </AuthProvider>
          </UserProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
