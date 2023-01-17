import PropTypes from 'prop-types'
import { MenuItem } from '@mui/material';
import { Link } from "react-router-dom";

export default function LinkMenuItem(props) {
  const {children, ...otherProps} = props

  return (
    <MenuItem component={Link}
      {...otherProps} >
      {children}
    </MenuItem>
  );
}

LinkMenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  sx: PropTypes.object,
}
