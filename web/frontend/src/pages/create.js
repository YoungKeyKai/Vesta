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

import { provinces } from '../constants';
import { useAuthContext } from '../contexts/auth-context';
import { MuiFileInput } from "mui-file-input";
import { DashboardLayout } from '../components/dashboard-layout';

const CreateListing = () => {
  const {authAxios, userId} = useAuthContext();

  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  //const [owner, setOwner] = useState(null);  
  const [listing, setListing] = useState({
    duration: { bounds: "[)" },
    rate: { bounds: "[)" }
  });
  const [floorplanFile, setFloorplanFile] = useState(null);
  const [images, setImages] = useState([]);
  const imagesURL = [];

  // History
  const router = useRouter();

  // useEffect Hook on Page Load
  useEffect(() => {
    const getProperties = () => {
      axios.get('/api/listingproperties/')
        .then((res) => {
          setProperties(res.data);
        })
        .catch(console.error)
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
    setFloorplanFile(newFile);
  }

  const handleImageUpload = (newFiles) => {
    setImages(newFiles);
  }

  const postFloorplan = () => {
    if (floorplanFile != null) {
      authAxios.post('/api/useruploads/', {
        owner: userId,
        uploadtime: new Date(), // gets the current date/time
        content: floorplanFile
      }, { 
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then((response) => {
          postProperty({floorplan: response.data.id})
        })
        .catch(error => console.log(error))
    } else {
      postProperty();
    }
  }

  const postPhoto = (foreignKeys = []) => {
    if (images.length > 0) {
      authAxios.post('/api/useruploads/', {
        owner: userId,
        uploadtime: new Date(), // gets the current date/time
        content: images.at(-1)
      }, { 
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then((response) => {
          imagesURL.push(response.data.content.replace('&export=download', ''))
          setImages(images.pop());
          postPhoto(foreignKeys);
        })
        .catch(console.error)
    } else {
      postFloorplan();
    }
  }

  const postProperty = (foreignKeys = {}) => {
    if (property?.id == null) {
      // first create the new property to use with new listing
      authAxios.post('/api/listingproperties/', property)
        .then((response) => {
          setProperty(response.data);
          foreignKeys.propertyID = response.data.id; 
          postListing(foreignKeys);
        })
        .catch((err) => console.log(err));
    } else {
      // just create the listing using existing property
      foreignKeys.propertyID = property.id;
      postListing(foreignKeys);
    }
        
  }

  const postListing = (foreignKeys = {}) => {
    // next create the new listing, using new (or existing) propertyID
    authAxios.post(
      '/api/listinglistings/', 
      {
        ...listing,
        ...foreignKeys,
        images: imagesURL,
        owner: userId,
        duration: JSON.stringify(listing.duration),
        rate: JSON.stringify(listing.rate),
      }
    )
      .then((res) => {
        router.replace(`/listing?id=${res.data.id}`);
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
                  value={floorplanFile}
                  onChange={handleFileChange}
                />
              </Box>
              Images:
              <Box>
                <MuiFileInput
                  placeholder="Upload Attachment"
                  value={images}
                  onChange={handleImageUpload}
                  multiple={true}
                />
              </Box>
            </div>
            <br/>
            <Box sx={{'& > :not(style)': { m: 1 }}}>
              <TextField type="text"
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
            <Button variant="contained" onClick={postPhoto}>Create</Button>
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

