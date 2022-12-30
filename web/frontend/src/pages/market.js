import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { 
    Box,
    Container,
    Card,
    CardContent,
    Pagination 
} from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import UtiltiesList from '../components/utilitiesList';
import { colors, terms } from '../constants'
import sampleImg from '../media/fergushousesample.jpg';

const Market = () => {

    // Listings: array
    const [listings, setListings] = useState([]);
    // Properties: Map
    const [properties, setProperties] = useState(new Map());
    // Page Number : number
    const [pageNum, setPageNum] = useState(1);
    // Current Page of Listings
    const [page, setPage] = useState([]);

    // History
    const router = useRouter();

    // useEffect Hook on Page Load
    useEffect(() => {
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

        // Fetch Listings
        getListings();
    }, []);

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
            setPage(listings.slice(6 * (value - 1), 6 * value));
        }
    }

    const routeChange = (id) => {
        router.push(`/listing?id=${id}`);
    }

    const convertDate = (date) => new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: 'short' })

    const renderTiles = () => page.map(
        (listing, index) => {
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
                <Card
                    className='market-listing-card'
                    onClick={() => { routeChange(listing.id) }}
                    key={index}
                    sx={{ backgroundColor: bgcolor }}>
                    <CardContent>
                        <div className='market-listing-card-body'>
                            <div className='market-listing-card-left'>
                                <h4>{property ? property.name : terms.loading}</h4>
                                <div>{property ? property.address : terms.loading}</div>
                                <div>{property ? `${property.city}, ${property.country}` : terms.loading}</div>
                                <div>{convertDate(duration.lower)} - {convertDate(duration.upper)}</div>
                            </div>
                            <div className='market-listing-card-right'>
                                <h4> </h4>
                                <div>Asking for: $ {`${rate.lower} - ${rate.upper}`}</div>
                                <UtiltiesList utilities={listing.utilities} />
                            </div>
                            <div className='market-listing-card-image'>
                                <img
                                    className="property-thumbnail"
                                    src={sampleImg}
                                    alt="Property Thumbnail"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        }
    )

    return (
        <>
        <Head>
            <title>
                Market | Vesta
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
                <div className='Market'>
                    <h1>Market</h1>
                    {page.length ? (
                        <div>
                            <div className='market-results-info'>
                                Showing {6 * (pageNum - 1) + 1}-{6 * (pageNum - 1) + 6} of {listings.length} Results
                            </div>
                            <div className='market-listings'>
                                {renderTiles()}
                            </div>
                        </div>
                    ) : (
                        <div>No Results Found</div>
                    )}

                    <div className="pagination-wrapper">
                        <Pagination
                            count={Math.ceil(listings.length / 6)}
                            page={pageNum}
                            onChange={handlePageUpdate}
                            color="secondary"
                            shape="rounded"
                        />
                    </div>
                </div>
            </Container>
        </Box>
        </>
    );
}

Market.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Market;