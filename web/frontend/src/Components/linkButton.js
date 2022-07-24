import PropTypes from 'prop-types'
import { Button } from '@mui/material';
import { Link } from "react-router-dom";

export default function LinkButton(props) {
    const {children, ...otherProps} = props

    return (
        <Button component={Link} {...otherProps} >
            {children}
        </Button>
    );
}

LinkButton.propTypes = {
    to: PropTypes.string.isRequired,
    variant: PropTypes.string,
    sx: PropTypes.object,
    className: PropTypes.string,
}

LinkButton.defaultProps = {
    variant: 'contained'
}
