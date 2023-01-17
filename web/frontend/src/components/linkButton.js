import PropTypes from 'prop-types'
import { Button } from '@mui/material';
import Link from 'next/link';

export default function LinkButton(props) {
  const {children, ...otherProps} = props

  return (
    <Link {...otherProps}>
      <Button {...otherProps}>
        {children}
      </Button>
    </Link>   
  );
}

LinkButton.propTypes = {
  href: PropTypes.string.isRequired,
  variant: PropTypes.string,
  sx: PropTypes.object,
  className: PropTypes.string,
}

LinkButton.defaultProps = {
  variant: 'contained'
}
