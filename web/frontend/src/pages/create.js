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
import { MuiFileInput } from "mui-file-input";
import { DashboardLayout } from '../components/dashboard-layout';

const CreateListing = () => {

  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  //const [owner, setOwner] = useState(null);  
  const [listing, setListing] = useState({
    duration: { bounds: "[)" },
    rate: { bounds: "[)" }
  });
  const [file, setFile] = useState(null);

  // History
  const router = useRouter();

  // useEffect Hook on Page Load
  useEffect(() => {
    const getProperties = () => {
      axios.get('/api/listingproperties/')
        .then((res) => {
          setProperties(res.data);
        })
        .catch((err) => {
          //Replace with formal error handling
          console.log(err);
        })
    }

    // Fetch Properties
    getProperties();
  }, []);

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
    })
  }

  const handleStatusChange = (event, newStatus) => {
    setListing({
      ...listing,
      status: newStatus,
    });
  }

  const handleFileChange = (newFile) => {
    setFile(newFile);
  }

  const handleSubmit = () => {
    if (property?.id == null) {
      // first create the new property to use with new listing
      axios.post('/api/listingproperties/', property)
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
    // first try to upload file if it exists
    if (file != null) {
      axios.post('/api/useruploads/', {
        owner: 3, // Need to remove hardcoded user, and use current user
        uploadtime: new Date(), // gets the current date/time
        content: file
      }, { 
        headers : { 'Content-Type': 'multipart/form-data'}
      })
      .then((response) => {
        setListing({
          ...listing,
          floorplan: response.data.id // use the upload ID
        });
      })
      .catch(error => console.log(error))
    }

    // next create the new listing, using new (or existing) propertyID
    axios.post('/api/listinglistings/', {
        ...listing,
        propertyID: property?.id || newPropertyID,   // use newPropertyID if property.id is null
        owner: 3,   // Need to remove hardcoded user, and use current user
        duration: JSON.stringify(listing.duration),
        rate: JSON.stringify(listing.rate),
      })
      .then((res) => {
        router.push(`/listing?id=${res.data.id}`);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Head>
        <title>
                Create Listing | Vesta
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
          <div className='create-listing'>
            <h1>Create Listing</h1>
            <div>
                        Property
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <Autocomplete
                  disablePortal
                  options={properties}
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
                  <MenuItem value={'AB'}>AB</MenuItem>
                  <MenuItem value={'BC'}>BC</MenuItem>
                  <MenuItem value={'MB'}>MB</MenuItem>
                  <MenuItem value={'NB'}>NB</MenuItem>
                  <MenuItem value={'NL'}>NL</MenuItem>
                  <MenuItem value={'NT'}>NT</MenuItem>
                  <MenuItem value={'NS'}>NS</MenuItem>
                  <MenuItem value={'NU'}>NU</MenuItem>
                  <MenuItem value={'ON'}>ON</MenuItem>
                  <MenuItem value={'PE'}>PE</MenuItem>
                  <MenuItem value={'QC'}>QC</MenuItem>
                  <MenuItem value={'SK'}>SK</MenuItem>
                  <MenuItem value={'YT'}>YT</MenuItem>
                </TextField>
              </Box>
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="text"
                  variant="filled"
                  label="Unit"
                  name="unit"
                  onChange={handleListingChange} />
              </Box>
              <br/>
                        Duration
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="date"
                  variant="filled"
                  label="From"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleListingDurationLowerChange} />
                <TextField type="date"
                  variant="filled"
                  label="To"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleListingDurationUpperChange} />
              </Box>
              <br/>
                        Rate
              <Box sx={{'& > :not(style)': { m: 1, width: '25ch' }}}>
                <TextField type="text"
                  variant="filled"
                  label="Minimum"
                  InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoney /></InputAdornment>) }}
                  onChange={handleListingRateLowerChange} />
                <TextField type="text"
                  variant="filled"
                  label="Maximum"
                  InputProps={{ startAdornment: (<InputAdornment position="start"><AttachMoney /></InputAdornment>) }}
                  onChange={handleListingRateUpperChange} />
              </Box>
              <br/>
                        Utilities:
              <Box sx={{'& > :not(style)': { m: 1 }}}>
                <Autocomplete
                  multiple
                  value={listing.utilities}
                  options={["Wifi", "Electricity", "Kitchen", "Laundry", "Food"]}
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
              <br/>
              Floorplan:
              <Box>
                <MuiFileInput
                  placeholder="Upload Attachment"
                  value={file}
                  onChange={handleFileChange}
                />
              </Box>
            </div>
            <br/>
            <Box sx={{'& > :not(style)': { m: 1 }}}>
              <TextField TextField type="text"
                fullWidth
                multiline
                variant="filled"
                label="Description"
                name="description"
                inputProps={{ maxLength: 1024 }}
                onChange={handleListingChange}>
              </TextField>
            </Box>
            <br/>
            <Button variant="contained" onClick={handleSubmit}>Create</Button>
          </div>
        </Container>
      </Box>
    </>
  );
}

CreateListing.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CreateListing;

