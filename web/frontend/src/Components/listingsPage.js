import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

import '../css/listingsPage.css';
import UtiltiesList from './utilitiesList';
import { googleMapsAPIKey } from '../constants';

export default function ListingsPage() {
    const [listing, setListing] = useState({});
    const [property, setProperty] = useState({});
    const [googleMapsAddr, setGoogleMapsAddr] = useState('');
    const [searchParams] = useSearchParams();

    const maxXS = 12;
    const propertyGridSize = 7;
    const tagGridSize = 4;

    const formatAddr = (addr, city, country) => `${addr.replaceAll(/ +/g, '+')},${city}+${country}`;
    useEffect(() => {
        const getProperty = id => axios
            .get(`/api/listingproperties/${id}`)
            .then((res) => {
                const data = res.data;
                setProperty(data);
                setGoogleMapsAddr(formatAddr(data.address, data.city, data.country));
            })
            .catch((err) => {
                //Replace with formal error handling
                console.log(err);
            });

        const getListing = () => axios
            .get(`/api/listinglistings/${searchParams.get('id')}`)
            .then((res) => {
                const data = res.data;
                setListing(data);
                getProperty(data.propertyID);
            })
            .catch((err) => {
                //Replace with formal error handling
                console.log(err);
            });

        getListing();
    }, [searchParams])

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

    return (
        <div className='listings-page'>
            {
                listing && property && googleMapsAddr ?
                    <Grid className='listings-page-grid' container>
                        <Grid item className='property-info' xs={propertyGridSize} flexDirection="column">
                            <div className='address-price'>
                                <h1>{`${property.name}, Unit ${listing.unit}`} </h1>
                                <h3>{`${property.address}, ${property.city}, ${property.country}`}</h3>
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
                        <Grid item className='utilities-summary' xs={maxXS - propertyGridSize}>
                            <h2>Utilities</h2>
                            <UtiltiesList utilities={listing.utilities} />
                        </Grid>
                        <Grid item className='tags' xs={tagGridSize}>
                            <h2>Tags</h2>
                        </Grid>
                        <Grid item className='user-description' xs={maxXS - tagGridSize}>
                            <h2>Description</h2>
                        </Grid>
                    </Grid> :
                    <CircularProgress className="loading-circle" size="5rem" />
            }
        </div>
    );
}
