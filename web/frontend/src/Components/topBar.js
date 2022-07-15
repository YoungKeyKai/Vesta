import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';

import SearchBox from './searchBox';

export default function TopBar(props) {
    const {height, width} = props.sx;

    return (
        <AppBar position="static" sx={{height, width}}>
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
