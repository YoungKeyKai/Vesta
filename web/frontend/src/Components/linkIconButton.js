import PropTypes from 'prop-types'
import { IconButton } from '@mui/material';
import { Link } from "react-router-dom";

export default function LinkIconButton(props) {
    const {children, ...otherProps} = props

    return (
        <IconButton component={Link} {...otherProps} >
            {children}
        </IconButton>
    );
}

LinkIconButton.propTypes = {
    to: PropTypes.string.isRequired,
    sx: PropTypes.object,
}
