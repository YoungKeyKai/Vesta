import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

import '../css/listingsPage.css';
import { googleMapsAPIKey, terms } from '../constants';

export default function ListingsPage() {
    const maxXS = 12;
    const propertyGridSize = 7;
    const tagGridSize = 4;

    const [listing, setListing] = useState({});
    const [property, setProperty] = useState({});
    const [googleMapsAddr, setGoogleMapsAddr] = useState('');
    const [searchParams] = useSearchParams();

    const formatAddr = (addr, city, country) => `${addr.replaceAll(/ +/g, '+')},${city}+${country}`;

    useEffect(() => {
        const getProperty = id => axios
            .get(`/api/listingproperties/${id}`)
            .then((res) => {
                const data = res.data;
                setProperty(data);
                setGoogleMapsAddr(formatAddr(data.address, data.city, data.country));
            });

        const getListing = () => axios
            .get(`/api/listinglistings/${searchParams.get('id')}`)
            .then((res) => {
                const data = res.data;
                setListing(data);
                getProperty(data.propertyID);
            });

        getListing();
    }, [searchParams])

    return (
        <div className='listings-page'>
            {
                listing && property && googleMapsAddr ?
                    <Grid className='listings-page-grid' container spacing={2}>
                        <Grid className='property-info' xs={propertyGridSize}>
                            <div className='AddressAndPrice'>
                                <h1>{property.name} {listing.unit}</h1>
                            </div>
                            <div className="map-wrapper">
                                <iframe
                                    title='GoogleMapsEmbed'
                                    className='google-maps-embed'
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsAPIKey}&q=${googleMapsAddr}`}
                                />
                            </div>
                        </Grid>
                        <Grid className='utilities-summary' xs={maxXS - propertyGridSize}>
                        </Grid>
                        <Grid className='tags' xs={tagGridSize}>
                        </Grid>
                        <Grid className='user-description' xs={maxXS - tagGridSize}>
                        </Grid>
                    </Grid> :
                    <CircularProgress className="loading-circle" size="5rem" />
            }
        </div>
    );
}
