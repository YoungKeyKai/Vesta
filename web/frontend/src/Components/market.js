import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination';

import '../css/market.css'

export default function Market() {

    // Listings
    const [listings, setListings] = useState([]);
    const [properties, setProperties] = useState(new Map());

    // useEffect Hook on Page Load
    useEffect(() => {
        // Fetch Listings
        getListings();
    }, []);

    const getListings = () => {
        axios.get('/api/listinglistings')
            .then((res) => {
                setListings(res.data);
                //Get corresponding properties
                getProperties(res.data);
            })
            .catch((err) => {
                //Replace with formal error handling
                console.log(err);
            })
    }

    const getProperties = (listings) => {
        // Store a Cache of Properties already fetched
        let Pmap = new Map();
        let requests = [];
        for (const listing of listings) {
            requests.push(axios.get(`/api/listingproperties/${listing.propertyID}`));
        }
        // Need to finish all requests before updating state
        axios.all(requests).then(axios.spread((...responses) => {
            console.log(responses);
            for (const res of responses) {
                console.log(res);
                if (!Pmap.has(res.data.id)) {
                    Pmap.set(res.data.id, res.data);
                }
            }
            setProperties(Pmap);
        })).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className='Market'>
            <h1>Market</h1>
            <div>
                <div className='market-results-info'>
                    Showing 1-6 of {listings.length} Results
                </div>
                <div className='market-listings'>
                    {listings.map( (listing, index) => {
                        const property = properties.get(listing.propertyID);
                        const duration = JSON.parse(listing.duration);
                        return (
                        <Card className='market-listing-card' key={index} sx={{backgroundColor: "#84CEEB"}}>
                            <CardContent>
                                <div>{property ? property.name : 'Name'}</div>
                                <div>{duration.lower} - {duration.upper}</div>
                            </CardContent>
                        </Card>
                        )
                    })}
                </div>
            </div>
            <Pagination count={10} color="secondary"/>
        </div>
    );
}
