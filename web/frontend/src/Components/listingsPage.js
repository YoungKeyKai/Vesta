import './listingsPage.css';

export default function ListingsPage() {
    const TEMP_APIKEY = 'AIzaSyClRBH_pT4waqp3BxnTtJw_7z-6clxz_HU';
    const TEMP_LOCATION = '110+University+Ave+West,Waterloo+Ontario';

    return (
        <div className='ListingsPageWrapper'>
            <div className='ListingsPageLeftWrapper'>
                <iframe
                    title='GoogleMapsEmbed'
                    className='ListingsPage-GoogleMapsEmbed'
                    referrerpolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${TEMP_APIKEY}&q=${TEMP_LOCATION}`}>
                </iframe>
            </div>
            <div className='ListingsPageRightWrapper'>
            </div>
        </div>
    );
}
