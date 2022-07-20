import './listingsPage.css';

export default function ListingsPage() {
    const TEMP_APIKEY = 'AIzaSyClRBH_pT4waqp3BxnTtJw_7z-6clxz_HU';
    const TEMP_LOCATION = '110+University+Ave+West,Waterloo+Ontario';

    return (
        <div className='ListingsPage'>
            <div className='LeftColumn'>
                <div className='AddressAndPrice'>
                    AddressAndPrice
                </div>
                <iframe
                    title='GoogleMapsEmbed'
                    className='GoogleMapsEmbed'
                    referrerpolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${TEMP_APIKEY}&q=${TEMP_LOCATION}`}>
                </iframe>
            </div>
            <div className='RightColumn'>
            </div>
        </div>
    );
}
