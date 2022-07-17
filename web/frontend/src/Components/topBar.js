import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import SearchBox from './searchBox';

function ProfileButton() {
    return (
        <IconButton>
            <AccountCircleIcon sx={{ fill: 'white' }} />
        </IconButton>
    );
}

export default function TopBar(props) {
    const { height, width } = props.sx;

    return (
        <AppBar position="static" sx={{ height, width }}>
            <Toolbar sx={{ height, bgcolor: '#283860' }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Vesta
                </Typography>
                <SearchBox />
                <Box sx={{ flexGrow: 1 }} />
                <ProfileButton />
            </Toolbar>
        </AppBar>
    );
}

TopBar.propTypes = {
    sx: PropTypes.shape({
        height: PropTypes.string,
        width: PropTypes.string,
    }),
}

TopBar.defaultProps = {
    sx: {
        height: '10vh',
        width: '100vw',
    }
}
