import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination';

import '../css/market.css'
import {colors} from './constants'
import sampleImg from '../media/fergushousesample.jpg';

export default function Market() {

    // Listings: array
    const [listings, setListings] = useState([]);
    // Properties: Map
    const [properties, setProperties] = useState(new Map());
    // Page Number : number
    const [pageNum, setPageNum] = useState(1);
    // Current Page of Listings
    const [page, setPage] = useState([]);

    // useEffect Hook on Page Load
    useEffect(() => {
        // Fetch Listings
        getListings();
    }, []);

    const getListings = () => {
        axios.get('/api/listinglistings')
            .then((res) => {
                setListings(res.data);
                setPage(res.data.slice(0, 6));
                //Get corresponding properties
                getProperties(res.data);
            })
            .catch((err) => {
                //Replace with formal error handling
                console.log(err);
            })
    }

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
        })).catch(err => {
            console.log(err);
        })
    }

    const handlePageUpdate = (event, value) => {
        setPageNum(value);
        if (listings.length < 6 * value) {
            setPage(listings.slice(6 * (value - 1)));
        } else {
            setPage(listings.slice(6 * (value - 1), 6));
        }
    }

    return (
        <div className='Market'>
            <h1>Market</h1>
            <div>
                <div className='market-results-info'>
                    Showing {6 * (pageNum - 1) + 1 }-{6 * (pageNum - 1) + 6} of {listings.length} Results
                </div>
                <div className='market-listings'>
                    {page.map( (listing, index) => {
                        const property = properties.get(listing.propertyID);
                        const duration = JSON.parse(listing.duration);
                        const rate = JSON.parse(listing.rate);
                        // Card Background Color
                        let bgcolor = colors[1];
                        if (index < 2) {
                            bgcolor = colors[0];
                        } else if (index > 3) {
                            bgcolor = colors[2];
                        } 
                        return (
                            <Card className='market-listing-card' key={index} sx={{ backgroundColor: bgcolor }}>
                                <CardContent>
                                    <div className='market-listing-card-body'>
                                        <div className='market-listing-card-left'>
                                            <div>{property ? property.name : 'Loading...'}</div>
                                            <div>{property ? property.address : 'Loading...'}</div>
                                            <div>{property ? `${property.city}, ${property.country}` : 'Loading...'}</div>
                                            <div>{duration.lower} - {duration.upper}</div>
                                        </div>
                                        <div className='market-listing-card-right'>
                                            <div>$ {`${rate.lower} - ${rate.upper}`}</div>
                                            <div className='listing-utilities'>
                                                {listing.utilities.map( util => (
                                                    <div>{util}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='market-listing-card-image'>
                                            <img src={sampleImg} width="100%" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
            <div className="pagination-wrapper">
                <Pagination 
                    count={Math.ceil(listings.length / 6)} 
                    page={pageNum}
                    onChange={handlePageUpdate} 
                    color="secondary" 
                    shape="rounded"/>
            </div>
        </div>
    );
}
