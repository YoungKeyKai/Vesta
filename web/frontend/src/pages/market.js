import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { 
  Box,
  Button,
  Container,
  Checkbox,
  Slider,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { 
  WifiTooltip,
  ElectricToolTip,
  KitchenTooltip,
  LaundryTooltip,
  LocalDiningTooltip 
} from '../icons/utilities';
import { useAuthContext } from '../contexts/auth-context';
import MarketListingsTable from '../components/market/market-listings-table';

const Market = () => {
  // Listings: array
  const [listings, setListings] = useState([]);

  // Properties: Map
  const [properties, setProperties] = useState(new Map());

  // Is loading marker
  const [isLoading, setIsLoading] = useState(true);

  const {authAxios, isAuthenticated} = useAuthContext();

  // History
  const router = useRouter();

  // Parse URL Parameters
  const [filters, setFilters] = useState({});

  // useEffect Hook on Page Load
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const params = router.query;

    const getListings = () => {
      const reqFilters = new URLSearchParams(params).toString();
      
      setIsLoading(true)

      const axiosInstance = isAuthenticated ? authAxios : axios
      axiosInstance.get(`/api/listinglistings?${reqFilters}`)
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

    // Set Filters
    setFilters(params);

    // Fetch Listings
    getListings();
  }, [router.isReady, router.query, isAuthenticated]);

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

  const applyFilter = () => {
    router.push(`/market?${new URLSearchParams(filters).toString()}`);
  }

  const renderFilters = () => (
    <Box className='advanced-filters' sx={{ display: 'flex', my: 3 }}>
      <Box sx={{ width: 200, mx: 2 }}>
        <Typography>
          Price ($)
        </Typography>
        <Slider
          value={[filters.minprice ?? 0, filters.maxprice ?? 4000]}
          step={100}
          min={0}
          max={4000}
          onChange={(event, newValue) => { setFilters({ 
            ...filters, 
            minprice: newValue[0],
            maxprice: newValue[1] 
          }) }}
          valueLabelDisplay="auto"
        ></Slider>
      </Box>
      <Box sx={{ mx: 3, display: 'flex' }}>
        <Box sx={{ width: 200, mx: 1 }}>
          <Typography>
            Start Date
          </Typography>
          <TextField 
            type="date"
            value={filters.startDate}
            onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }) }}
          >
          </TextField>
        </Box>
        <Box sx={{ width: 200, mx: 1 }}>
          <Typography>
            End Date
          </Typography>
          <TextField 
            type="date"
            value={filters.endDate}
            onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }) }}
          >
          </TextField>
        </Box>
      </Box>
      <Box sx={{ width: 300, mx: 1 }}>
        <Typography>
          Location (city)
        </Typography>
        <TextField
          onChange={(e) => { setFilters({ ...filters, location: e.target.value })}}
        >  
        </TextField>
      </Box>
      <Box sx={{ width: 600, mx: 3, display: 'flex', justifyContent: 'center' }}>
        <Box>
          <WifiTooltip />
          <Checkbox color="primary"
            checked={filters['Wifi'] === 'false'? false : true}
            onChange={(e, newValue) => {
              setFilters({ ...filters, Wifi: newValue.toString() });
            }}
          />
        </Box>
        <Box>
          <ElectricToolTip />
          <Checkbox color="primary"
            checked={filters['Electricity'] == 'false'? false : true}
            onChange={(e, newValue) => {
              setFilters({ ...filters, Electricity: newValue.toString() });
            }}
          />
        </Box>
        <Box>
          <KitchenTooltip />
          <Checkbox color="primary"
            checked={filters['Kitchen'] == 'false'? false : true}
            onChange={(e, newValue) => { 
              setFilters({ ...filters, Kitchen: newValue.toString() }); 
            }}
          />
        </Box>
        <Box>
          <LaundryTooltip />
          <Checkbox color="primary"
            checked={filters['Laundry'] == 'false'? false : true}
            onChange={(e, newValue) => { 
              setFilters({ ...filters, Laundry: newValue.toString() });
            }}
          />
        </Box>
        <Box>
          <LocalDiningTooltip />
          <Checkbox color="primary"
            checked={filters['Food'] == 'false'? false : true}
            onChange={(e, newValue) => { 
              setFilters({ ...filters, Food: newValue.toString() }); 
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Button onClick={applyFilter} variant="outlined">
          Apply
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      <Head>
        <title>
          Market | Vesta
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
            <h1>Market</h1>
            {renderFilters()}
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

Market.getLayout = (page) => (
  <DashboardLayout noGuard={true}>
    {page}
  </DashboardLayout>
);

export default Market;
