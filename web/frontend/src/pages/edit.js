import Head from 'next/head';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  TextField,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  InputAdornment,
  Button,
  Container,
  MenuItem
} from '@mui/material/';
import { AttachMoney } from '@mui/icons-material';
import { DashboardLayout } from '../components/dashboard-layout';
import { useAuthContext } from '../contexts/auth-context';

import { provinces } from '../constants';

const EditListing = () => {
  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const {authAxios, userId} = useAuthContext();  
  const [listing, setListing] = useState({
    duration: { bounds: "[)" },
    rate: { bounds: "[)" }
  });

  // History
  const router = useRouter();
  const { id } = router.query;

  // useEffect Hook on Page Load
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // Load all property options 
    const getProperties = () => {
      axios.get('/api/listingproperties/')
        .then((res) => {
          setProperties(res.data);
        })
        .catch((err) => {
          //Replace with formal error handling
          console.log(err);
        })
    };

    const getProperty = (propertyID) => {
      axios.get(`/api/listingproperties/${propertyID}`)
        .then((res) => {
          const data = res.data;
          setProperty(data);
        })
        .catch((err) => {
        //Replace with formal error handling
          console.log(err);
        })

    }

    const getListing = () => {
      axios.get(`/api/listinglistings/${id}`)
        .then((res) => {
          const data = res.data;
          setListing({
            ...data,
            duration: JSON.parse(data.duration),
            rate: JSON.parse(data.rate),
          });
          getProperty(data.propertyID);
          setUtilities(data.utilities);
        })
        .catch((err) => {
        //Replace with formal error handling
          console.log(err);
        })
    }

    // Fetch Properties
    getProperties();
    getListing();

  }, [router.isReady, id]);

  // for creating new property
  const handlePropertyChange = (event) => {
    setProperty ({
      ...property,
      [event.target.name]: event.target.value,
    });
  }

  // for selecting existing property
  const handleSelectedPropertyChange = (event, newProperty) => {
    // only the ID really matters since its used to reference
    setProperty(newProperty);
  }

  const handleListingChange = (event) => {
    setListing ({
      ...listing,
      [event.target.name]: event.target.value,
    });
  }

  const handleListingDurationLowerChange = (event) => {
    setListing ({
      ...listing,
      duration: {
        ...listing.duration,
        lower: event.target.value,
      }
    });
  }

  const handleListingDurationUpperChange = (event) => {
    setListing ({
      ...listing,
      duration: {
        ...listing.duration,
        upper: event.target.value,
      }
    });
  }

  const handleListingRateLowerChange = (event) => {
    setListing ({
      ...listing,
      rate: {
        ...listing.rate,
        lower: event.target.value,
      }
    });
  }

  const handleListingRateUpperChange = (event) => {
    setListing ({
      ...listing,
      rate: {
        ...listing.rate,
        upper: event.target.value,
      }
    });
  }

  const handleListingUtilitiesChange = (event, newUtilities) => {
    setListing({
      ...listing,
      utilities: newUtilities,
    });
    setUtilities(newUtilities);
  }

  const handleStatusChange = (event, newStatus) => {
    setListing({
      ...listing,
      status: newStatus,
    });
  }

  const handleSubmit = () => {
    if (property?.id == null) {
      // first create the new property to use with new listing
      authAxios.post('/api/listingproperties/', property)
        .then((response) => {
          setProperty(response.data); 
          postListing(response.data.id);
        })
        .catch((err) => console.log(err));
    } else {
      // jsut create the listing using existing property
      postListing();
    }
  }

  const postListing = (newPropertyID = null) => {
    // Update the new listing, using new (or existing) propertyID
    authAxios.put(`/api/listinglistings/${id}/`, {
      ...listing,
      propertyID: property?.id || newPropertyID,   // use newPropertyID if property.id is null
      owner: userId,   // Need to remove hardcoded user, and use current user
      duration: JSON.stringify(listing.duration),
      rate: JSON.stringify(listing.rate),
    })
      .then((res) => {
        router.replace(`/listing?id=${res.data.id}`);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Head>
        <title>
          Edit Listing | Vesta
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
          <div className='edit-listing'>
            <h1>Edit Listing</h1>
            <div>
              Property
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <Autocomplete
                  disablePortal
                  options={properties}
                  value = {property}
                  getOptionLabel={(option) => option.name}
                  onChange={handleSelectedPropertyChange}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField variant="filled"
                    hiddenLabel
                    {...params} />}
                />
              </Box>
              <br/>
              Info
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="text"
                  variant="filled"
                  disabled={property?.id != null}
                  label="Name"
                  name="name"
                  onChange={handlePropertyChange} />
                <TextField type="text"
                  variant="filled"
                  disabled={property?.id != null}
                  label="Address"
                  name="address"
                  onChange={handlePropertyChange} />
                <TextField type="text"
                  variant="filled"
                  disabled={property?.id != null}
                  label="City"
                  name="city"
                  onChange={handlePropertyChange} />
                <TextField type="text"
                  variant="filled"
                  disabled={property?.id != null}
                  label="Province"
                  name="province"
                  select
                  onChange={handlePropertyChange}
                >
                  {
                    provinces.map((provinceCode) => (
                      <MenuItem value={provinceCode} key={provinceCode}>{provinceCode}</MenuItem>
                    ))
                  }
                </TextField>
              </Box>
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="text"
                  variant="filled"
                  label="Unit"
                  name="unit"
                  value = {listing.unit}
                  onChange={handleListingChange} />
              </Box>
              <br/>
              Duration
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="date"
                  variant="filled"
                  label="From"
                  InputLabelProps={{ shrink: true }}
                  value = {listing.duration.lower}
                  onChange={handleListingDurationLowerChange} />
                <TextField type="date"
                  variant="filled"
                  label="To"
                  value = {listing.duration.upper}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleListingDurationUpperChange} />
              </Box>
              <br/>
              Rate
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="text"
                  variant="filled"
                  label="Minimum"
                  value = {listing.rate.lower}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoney /></InputAdornment>) }}
                  onChange={handleListingRateLowerChange} />
                <TextField type="text"
                  variant="filled"
                  label="Maximum"
                  value = {listing.rate.upper}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoney /></InputAdornment>) }}
                  onChange={handleListingRateUpperChange} />
              </Box>
              <br/>
              Utilities:
              <Box sx={{'& > :not(style)': { m: 1 }}}>
                <Autocomplete
                  multiple
                  value={utilities}
                  options={['Wifi', 'Electricity', 'Kitchen', 'Laundry', 'Food']}
                  onChange={handleListingUtilitiesChange}
                  freeSolo
                  renderInput={ (params) => (
                    <TextField hiddenLabel
                      variant="filled"
                      {...params} />
                  )}
                />
              </Box>
              <br/>
              Status:
              <Box sx={{'& > :not(style)': { m: 1 }}}>
                <ToggleButtonGroup
                  exclusive
                  value={listing.status}
                  onChange={handleStatusChange}
                >
                  <ToggleButton value="available">
                    Available
                  </ToggleButton>
                  <ToggleButton value="sold">
                    Sold
                  </ToggleButton>
                  <ToggleButton value="unavailable">
                    Unavailable
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>           
            </div>
            <br/>
            <Box sx={{'& > :not(style)': { m: 1 }}}>
              <TextField TextField type="text"
                fullWidth
                multiline
                variant="filled"
                value={listing.description}
                label="Description"
                name="description"
                inputProps={{ maxLength: 1024 }}
                onChange={handleListingChange}>
              </TextField>
            </Box>
            <br/>
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
          </div>
        </Container>
      </Box>
    </>
  );
}

EditListing.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EditListing;

