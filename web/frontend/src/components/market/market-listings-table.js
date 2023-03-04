import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Pagination
} from '@mui/material';
import UtiltiesList from '../utilitiesList';
import { colors, terms } from '../../constants';

const MarketListingsTable = ({
  listings,
  properties
}) => {
  // Page Number : number
  const [pageNum, setPageNum] = useState(1);

  // Current Page of Listings
  const [page, setPage] = useState([]);

  // History
  const router = useRouter();

  useEffect(() => {
    setPageNum(1);
    setPage(listings.slice(0, 6));
  }, [listings])

  const convertDate = (date) => new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: 'short' })
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
                <div>{property ? `${property.city}, ${property.province}` : terms.loading}</div>
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
                  src="/static/images/fergushousesample.jpg"
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
    <div className='market-listings-list'>
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
  )
}

MarketListingsTable.propTypes = {
  listings: PropTypes.array,
  properties: PropTypes.instanceOf(Map),
};

export default MarketListingsTable;
