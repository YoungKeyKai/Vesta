import PropTypes from 'prop-types';

import { Wifi, ElectricBolt, Kitchen, LocalLaundryService, LocalDining } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export default function UtiltiesList(props) {
  const { utilities } = props;

  let set = new Set();
  let elements = [];
  for (const util of utilities) {
    set.add(util);
  }
  // Render out special icons first then render the rest
  if (set.has('Wifi')) {
    elements.push(
      <Tooltip title="Wifi"
        key='wifiTooltip'>
        <Wifi sx={{ color: '#283860' }}
          key='wifi' />
      </Tooltip>
    );
    set.delete('Wifi');
  }
  if (set.has('Electricity')) {
    elements.push(
      <Tooltip title="Hydro"
        key='hydroTooltip'>
        <ElectricBolt sx={{ color: '#283860' }}
          key='hydro' />
      </Tooltip>
    );
    set.delete('Electricity');
  }
  if (set.has('Kitchen')) {
    elements.push(
      <Tooltip title="Kitchen"
        key='kitchenTooltip'>
        <Kitchen sx={{ color: '#283860' }}
          key='kitchen' />
      </Tooltip>
    );
    set.delete('Kitchen');
  }
  if (set.has('Laundry')) {
    elements.push(
      <Tooltip title="Laundry"
        key='laundryTooltip'>
        <LocalLaundryService sx={{ color: '#283860' }}
          key='laundry' />
      </Tooltip>
    );
    set.delete('Laundry');
  }
  if (set.has('Food')) {
    elements.push(
      <Tooltip title="Local Dining"
        key='localDiningTooltip'>
        <LocalDining sx={{ color: '#283860' }}
          key='localDining' />
      </Tooltip>
    );
    set.delete('Food');
  }

  let extras = '';
  if (set.size) {
    let delim = '+ ';
    for (const elem of set) {
      extras = `${extras}${delim}${elem}`;
      delim = ', ';
    }
  }
  return (
    <div className='listing-utilities'>
      <div>
        {elements}
      </div>
      <div>{extras}</div>
    </div>
  );
}

UtiltiesList.propTypes = {
  utilities: PropTypes.arrayOf(PropTypes.string).isRequired,
}
