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
import { googleMapsAPIKey } from '../constants';
import { useAuthContext } from '../contexts/auth-context';

const ListingsPage = () => {
  const [listing, setListing] = useState({});
  const [floorplanUrl, setFloorplanUrl] = useState('');
  const [property, setProperty] = useState({});
  const [googleMapsAddr, setGoogleMapsAddr] = useState('');
  const [interest, setInterest] = useState({isInterested: false, interestId: null});

  // Loading flags
  const [isLoadingListing, setIsLoadingListing] = useState(true); // Starts unloaded
  const [isLoadingInterest, setIsLoadingInterest] = useState(false); // Can start loaded if no user is logged in

  const {authAxios, userId, isAuthenticated} = useAuthContext();
  const router = useRouter();
  const { id } = router.query;

  const formatAddr = (addr, city, province) => `${addr.replaceAll(/ +/g, '+')},${city}+${province}`;
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const getFloorplan = (floorplanId) => axios
      .get(`/api/useruploads/${floorplanId}`)
      .then((res) => {
        setFloorplanUrl(res.data.content.replace('&export=download', ''));
        setIsLoadingListing(false);
      })
      .catch(console.error);

    const getProperty = id => axios
      .get(`/api/listingproperties/${id}`)
      .then((res) => {
        const data = res.data;
        setProperty(data);
        setGoogleMapsAddr(formatAddr(data.address, data.city, data.province));
      })
      .catch(console.error);

    const getListing = () => axios
      .get(`/api/listinglistings/${id}`)
      .then((res) => {
        const data = res.data;
        setListing(data);
        getProperty(data.propertyID);
        getFloorplan(data.floorplan);
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
          setInterest({isInterested: false, interestId: null});
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

  const getImages = () => {
    let urls = listing.images
    if (floorplanUrl) {
      urls = urls.concat([floorplanUrl])
    }
    return urls.map((image, i) => (
      <img className="photo" key={`photo${i}`} src={image} />
    ))
  }

  const getListingPageBody = () => {
    const gridRowSpacing = 3
    const gridColumns = 12;
    const carouselSize = gridColumns;
    const buttonHolderSize = 4;
    const propertyInfoSize = gridColumns - buttonHolderSize;
    const utilitySummarySize = gridColumns;
    const embeddedMapSize = gridColumns;
    const userDescriptionSize = gridColumns;

    return (
      <Grid container
        className='listings-page-grid'
        columns={gridColumns}
        rowSpacing={gridRowSpacing}
      >
        {
          listing.images || floorplanUrl ?
            <Grid item
              className='image-carousel-container'
              xs={carouselSize}
            >
              <Carousel className='image-carousel' autoPlay={false}>
                {getImages()}
              </Carousel>
            </Grid> :
            null
        }
        <Grid item
          className='property-info'
          xs={propertyInfoSize}
        >
          <div className='address-price'>
            <h1>{property.name}{listing.unit ? `, Unit ${listing.unit}` : ''}</h1>
            <h3>{`${property.address}, ${property.city}, ${property.province}`}</h3>
            <h3>{stringifyRate(listing.rate)}</h3>
            <h3>{stringifyDuration(listing.duration)}</h3>
          </div>
        </Grid>
        <Grid item
          className='button-holder'
          xs={buttonHolderSize}
        >
          {
            isAuthenticated && listing.owner !== userId ?
              <>
                <ToggleButton
                  className='bookmark-button'
                  selected={interest.isInterested}
                  onClick={handleToggleInterest}
                  sx={{marginRight: '1rem'}}
                >
                  {
                    interest.isInterested ?
                      <BookmarkRemoveIcon fontSize='large' />
                      : <BookmarkAddIcon fontSize='large' />
                  }
                </ToggleButton>
                <Button
                  className='message-seller-button'
                  variant="contained" 
                  color="secondary"
                  onClick={() => handleMessageOwner()}
                >
                  Message Seller
                </Button>
              </>
              : null
          }
          {
            listing.owner === userId ?
              <>
                <Button
                  className='delete-button'
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  sx={{marginRight: '1rem'}}
                >
                  Delete
                </Button>
                <Button
                  className='edit-button'
                  variant='contained'
                  color='success'
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </>
              : null
          }
        </Grid>
        <Grid item
          className='utilities-summary'
          xs={utilitySummarySize}
        >
          <h2>Utilities and Amenities</h2>
          <UtiltiesList utilities={listing.utilities} />
        </Grid>
        <Grid item
          className='embedded-map-container'
          xs={embeddedMapSize}
        >
          <iframe
            title='GoogleMapsEmbed'
            className='google-maps-embed'
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsAPIKey}&q=${googleMapsAddr}`}
          />
        </Grid>
        {
          listing.description ?
            <Grid item
              className='user-description'
              xs={userDescriptionSize}
            >
              <h2>Description</h2>
              <p className='user-description-text'>{listing.description}</p>
            </Grid>
            : null
        }
      </Grid>
    )
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
