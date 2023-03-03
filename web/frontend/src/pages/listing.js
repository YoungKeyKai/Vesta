import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Carousel from 'react-material-ui-carousel'
import {
  Grid,
  CircularProgress,
  Box,
  Button,
  Container,
  ToggleButton
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
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
  const [interest, setInterest] = useState({isInterested: false, interestId: null});

  // Loading flags
  const [isLoadingListing, setIsLoadingListing] = useState(true); // Starts unloaded
  const [isLoadingInterest, setIsLoadingInterest] = useState(false); // Can start loaded if no user is logged in

  const {authAxios, userId, isAuthenticated} = useAuthContext();
  const router = useRouter();
  const { id } = router.query;

  const maxXS = 12;
  const propertyGridSize = 7;
  const utilityGridSize = 7;
  const descriptionGridSize = 10;
  const deleteGridSize = 4;
  const photoGridSize = 8;
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
        setIsLoadingListing(false);
      })
      .catch(console.error);

    const getListing = () => axios
      .get(`/api/listinglistings/${id}`)
      .then((res) => {
        const data = res.data;
        setListing(data);
        getProperty(data.propertyID);
      })
      .catch(console.error);

    const getInterest = () => authAxios
      .get(`/api/listinginterests/?buyer=${userId}&listing=${id}`)
      .then((result) => {
        if (result.data.length !== 0) {
          // If buyer has an interest on this listing, the result should return a non-zero array
          setInterest({
            isInterested: true,
            interestId: result.data[0].id
          });
        } else {
          setInterest({});
        }
        setIsLoadingInterest(false)
      })
      .catch(console.error)
    
    setIsLoadingListing(true);
    getListing();
    if (isAuthenticated) {
      setIsLoadingInterest(true)
      getInterest();
    }
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

  const handleMessageOwner = () => {
    console.log('owner', listing.owner);
    router.push(`/chat/?receiver=${listing.owner}`);
  }

  const handleToggleInterest = () => {
    if (interest.isInterested) {
      // Currently interested, need to remove the interest
      setInterest({isInterested: false, interestId: null})
      authAxios
        .delete(`/api/listinginterests/${interest.interestId}`)
        .catch(console.error);
    } else {
      // Currently not interested, need to add the interest
      authAxios.post(
        '/api/listinginterests/',
        {
          seller: listing.owner,
          listing: listing.id,
          buyer: userId,
        }
      )
        .then((res) => setInterest({
          isInterested: true,
          interestId: res.data.id,
        }))
        .catch(console.error);
    }
  }

  const getListingPageBody = () => (
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
        isAuthenticated && listing.owner != userId ?
          <Grid item
            xs={maxXS - propertyGridSize}
          >
            <ToggleButton selected={interest.isInterested} onClick={handleToggleInterest} >
              {
                interest.isInterested ?
                  <BookmarkRemoveIcon fontSize='large' />
                  : <BookmarkAddIcon fontSize='large' />
              }
            </ToggleButton>
          </Grid> : null
      }
      <Grid item
        className='carousel'
        xs={photoGridSize}
      >
        <h2>Images</h2>
        {
          listing.images &&
          <Carousel autoPlay={false}>
            {
              listing.images.map((image, i) => (
                <img className="photos" src={image}></img>
              ))
            }
          </Carousel>
        }
      </Grid>
      <Grid item
        className='utilities-summary'
        xs={utilityGridSize}
      >
        <h2>Utilities and Amenities</h2>
        <UtiltiesList utilities={listing.utilities} />
      </Grid>
      {
        isAuthenticated &&
          <Grid item
            xs={maxXS - propertyGridSize}
          >
            <Button
              variant="contained" 
              color="secondary"
              onClick={() => handleMessageOwner()}
            >
              Message Owner
            </Button>
          </Grid>
      }
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
    </Grid>
  )

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
              !isLoadingListing && !isLoadingInterest ?
                getListingPageBody() :
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
