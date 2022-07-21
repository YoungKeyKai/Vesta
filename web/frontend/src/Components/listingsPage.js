import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import '../css/listingsPage.css';
import { googleMapsAPIKey, terms } from '../constants';

export default function ListingsPage() {
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
        <div className='ListingsPage'>
            <div className='LeftColumn'>
                <div className='AddressAndPrice'>
                    <h1>{property.name} {listing.unit}</h1>
                </div>
                <div className="map-wrapper">
                    {
                        googleMapsAddr ?
                            <iframe
                                title='GoogleMapsEmbed'
                                className='google-maps-embed'
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsAPIKey}&q=${googleMapsAddr}`}
                            /> :
                            <h2>{terms.loading}</h2>
                    }
                </div>
            </div>
            <div className='RightColumn'>
            </div>
        </div>
    );
}
