import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Typography, Box, Popper, ClickAwayListener, MenuList } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import SearchBox from './searchBox';
import LinkMenuItem from './linkMenuItem';
import LinkIconButton from './linkIconButton';
import { pages } from '../constants';

export default function TopBar(props) {
    const { height, width } = props.sx;
    const menuAnchor = useRef(null)

    const [isPageListMenuOpen, setIsPageListMenuOpen] = useState(false);
    const togglePageListMenu = () => {
        setIsPageListMenuOpen(!isPageListMenuOpen);
    }
    const PageListButton = () => (
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={togglePageListMenu}
        >
            <MenuIcon />
        </IconButton>
    );
    const PageListMenu = () => (
        <Popper
            open={isPageListMenuOpen}
            anchorEl={menuAnchor.current}
            placement='bottom-start'
            disablePortal
        >
            <ClickAwayListener onClickAway={togglePageListMenu}>
                <MenuList
                    autoFocusItem={isPageListMenuOpen}
                    sx={{ backgroundColor: 'white' }}
                >
                    {Object.keys(pages).map(page =>
                        pages[page].display &&
                        <LinkMenuItem
                            key={page}
                            to={pages[page].url}
                            onClick={togglePageListMenu}
                            sx={{ color: 'black' }}
                        >
                            {pages[page].name}
                        </LinkMenuItem>
                    )}
                </MenuList>
            </ClickAwayListener>
        </Popper>
    );

    const ProfileButton = () => (
        <LinkIconButton to={pages.loginPage.url}>
            <AccountCircleIcon sx={{ fill: 'white' }} />
        </LinkIconButton>
    );

    return (
        <AppBar position="static" ref={menuAnchor} sx={{ height, width: '100%' }}>
            <Toolbar sx={{ height, bgcolor: '#283860' }}>
                <PageListButton />
                <PageListMenu />
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
