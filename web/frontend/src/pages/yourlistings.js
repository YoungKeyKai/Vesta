import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box,
  Container,
  CircularProgress,
} from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { useAuthContext } from '../contexts/auth-context';
import MarketListingsTable from '../components/market/market-listings-table';

const YourListings = () => {
  // Listings: array
  const [listings, setListings] = useState([]);

  // Properties: Map
  const [properties, setProperties] = useState(new Map());

  // Is loading marker
  const [isLoading, setIsLoading] = useState(true);

  const {authAxios, userId, isAuthenticated} = useAuthContext();

  // useEffect Hook on Page Load
  useEffect(() => {
    const getListings = () => {
      setIsLoading(true)

      authAxios.get(`/api/listinglistings/?ownerId=${userId}`)
        .then((res) => {
          setListings(res.data);

          // Get corresponding properties
          getProperties(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false)
        })
    }

    // Fetch Listings
    getListings();
  }, [isAuthenticated, userId]);

  const getProperties = (listings) => {
    // Store a Set of Properties to fetch to avoid repeating API Calls
    let PSet = new Set();
    let PMap = new Map();
    let requests = [];
    for (const listing of listings) {
      PSet.add(listing.propertyID);
    }
    for (const ID of PSet) {
      requests.push(axios.get(`/api/listingproperties/${ID}`));
    }
    // Need to finish all requests before updating state
    axios.all(requests).then(axios.spread((...responses) => {
      for (const res of responses) {
        PMap.set(res.data.id, res.data);
      }
      setProperties(PMap);
      setIsLoading(false)
    })).catch(err => {
      console.log(err);
      setIsLoading(false)
    })
  }

  return (
    <>
      <Head>
        <title>
          Your Listings | Vesta
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
          <div className='Market'>
            <h1>Your Listings</h1>
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="20rem">
              {
                !isLoading ? 
                  <MarketListingsTable listings={listings} properties={properties} /> :
                  <CircularProgress className="loading-circle" size="5rem" />
              }
            </Box>
          </div>
        </Container>
      </Box>
    </>
  );
}

YourListings.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default YourListings;
