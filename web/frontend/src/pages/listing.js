import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  CircularProgress,
  Box,
  Button,
  Container,
  ToggleButton
} from '@mui/material';
import axios from 'axios';

import { DashboardLayout } from '../components/dashboard-layout';
import UtiltiesList from '../components/utilitiesList';
import ButtonFileDownload from '../components/button-file-download'
import { googleMapsAPIKey } from '../constants';
import { useAuthContext } from '../contexts/auth-context';

const ListingsPage = () => {
  const [listing, setListing] = useState({});
  const [property, setProperty] = useState({});
  const [googleMapsAddr, setGoogleMapsAddr] = useState('');
  const [buttonText, setButtonText] = useState("Interested");
  const [interest, setInterest] = useState({});
  const {authAxios, userId, isAuthenticated} = useAuthContext();
  const router = useRouter();
  const { id } = router.query;

  const maxXS = 12;
  const propertyGridSize = 7;
  const utilityGridSize = 7;
  const descriptionGridSize = 10;
  const deleteGridSize = 4;
  const editGridSize = 5;

  const formatAddr = (addr, city, province) => `${addr.replaceAll(/ +/g, '+')},${city}+${province}`;
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const getProperty = id => axios
      .get(`/api/listingproperties/${id}`)
      .then((res) => {
        const data = res.data;
        setProperty(data);
        setGoogleMapsAddr(formatAddr(data.address, data.city, data.province));
      })
      .catch((err) => {
        //Replace with formal error handling
        console.log(err);
      });

    const getListing = () => axios
      .get(`/api/listinglistings/${id}`)
      .then((res) => {
        const data = res.data;
        setListing(data);
        getProperty(data.propertyID);
        setInterest({
          seller: data.owner,
          listing: data.id
        });
        // getInterest(data.listing);
      })
      .catch((err) => {
        //Replace with formal error handling
        console.log(err);
      });

    getListing();
  }, [router.isReady, id])

  const stringifyRate = (jsonRate) => {
    const rate = JSON.parse(jsonRate);
    return `$${rate.lower} - $${rate.upper}`;
  }

  const stringifyDuration = (jsonDuration) => {
    const duration = JSON.parse(jsonDuration);
    const toDesiredString = (date) =>
      new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
    return `${toDesiredString(duration.lower)} - ${toDesiredString(duration.upper)}`;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you wish to delete this listing?')){
      authAxios.delete(`/api/listinglistings/${id}`)
        .then(() => {       
          alert("Listing deleted successfully!");
          router.push(`/market`);
        })
        .catch((err) => console.log(err));
    }
  }

  const handleEdit = () => {
    router.push(`/edit?id=${id}`);
  }

  function changeButtonText(buttonText) {
    if (buttonText === "Interested") {
      authAxios.post(
        '/api/listinginterests/',
        {
          ...interest,
          buyer: userId,
        }
      )
        .then((res) => {
          const data = res.data;
          setInterest({
            ...interest,
            id: data.id,
          });
        })
        .catch((err) => console.log(err));
    } else if(buttonText === "Uninterested") {
      authAxios.delete(`/api/listinginterests/${interest.id}`)
        .catch((err) => console.log(err));
    }
    setButtonText(prev => prev === "Interested" ? "Uninterested" : "Interested");
  }
 
  return (
    <>
      <Head>
        <title>
                Listing | Vesta
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
          <div className='listings-page'>
            {
              listing && property && googleMapsAddr ?
                <Grid className='listings-page-grid' container>
                  <Grid item
                    className='property-info'
                    xs={propertyGridSize}
                    flexDirection="column"
                  >
                    <div className='address-price'>
                      <h1>{property.name}{listing.unit ? `, Unit ${listing.unit}` : ''}</h1>
                      <h3>{`${property.address}, ${property.city}, ${property.province}`}</h3>
                      <h3>{stringifyRate(listing.rate)}</h3>
                      <h3>{stringifyDuration(listing.duration)}</h3>
                    </div>
                    <iframe
                      title='GoogleMapsEmbed'
                      className='google-maps-embed'
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsAPIKey}&q=${googleMapsAddr}`}
                    />
                  </Grid>
                  {
                    isAuthenticated &&
                      <Grid item
                        xs={maxXS - propertyGridSize}
                      >
                        <ToggleButton
                          selected={buttonText}
                          onClick={() => changeButtonText(buttonText)}
                        >
                          {buttonText}
                        </ToggleButton>
                      </Grid>
                  }
                  <Grid item
                    className='utilities-summary'
                    xs={utilityGridSize}
                  >
                    <h2>Utilities and Amenities</h2>
                    <UtiltiesList utilities={listing.utilities} />
                  </Grid>
                  <Grid item
                    className='user-description'
                    xs={descriptionGridSize}
                  >
                    <h2>Description</h2>
                    <h3>{listing.description}</h3>
                  </Grid>
                  {
                    listing.owner == userId &&
                      <Grid item
                        className='delete'
                        xs={maxXS - deleteGridSize}
                      >
                        <Button
                          className='delete-button'
                          variant="contained"
                          color="error"
                          onClick={handleDelete}
                        >
                          Delete
                        </Button>
                      </Grid>
                  }
                  {
                    listing.owner == userId &&
                    <Grid item
                      className='modify-buttons'
                      xs={maxXS - editGridSize}>
                      <Button className='edit-button' variant="contained" color="success" onClick={handleEdit}>Edit</Button>
                    </Grid> 
                  }
                  {
                    listing.floorplan ?
                      <Grid item // TODO: Remove this test button
                        className='download-image'
                        xs={maxXS - deleteGridSize}
                      >
                        <ButtonFileDownload userUploadId={listing.floorplan} text="Download Image" className='download-image-button' variant="contained" color="primary">Download Floorplan</ButtonFileDownload>
                      </Grid> : null
                  }
                </Grid> :
                <CircularProgress className="loading-circle"
                  size="5rem" />
            }
          </div>
        </Container>
      </Box>
    </>
  );
}

ListingsPage.getLayout = (page) => (
  <DashboardLayout noGuard={true}>
    {page}
  </DashboardLayout>
);

export default ListingsPage;
