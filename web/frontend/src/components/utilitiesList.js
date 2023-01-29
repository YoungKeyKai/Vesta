import PropTypes from 'prop-types';

import { 
  WifiTooltip,
  ElectricToolTip,
  KitchenTooltip,
  LaundryTooltip,
  LocalDiningTooltip 
} from '../icons/utilities';

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
      <WifiTooltip />
    );
    set.delete('Wifi');
  }
  if (set.has('Electricity')) {
    elements.push(
      <ElectricToolTip />
    );
    set.delete('Electricity');
  }
  if (set.has('Kitchen')) {
    elements.push(
      <KitchenTooltip />
    );
    set.delete('Kitchen');
  }
  if (set.has('Laundry')) {
    elements.push(
      <LaundryTooltip />
    );
    set.delete('Laundry');
  }
  if (set.has('Food')) {
    elements.push(
      <LocalDiningTooltip />
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
