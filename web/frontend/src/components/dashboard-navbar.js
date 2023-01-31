import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, Button, IconButton, InputAdornment, TextField, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Bell as BellIcon } from '../icons/bell';
import { AccountPopover } from './account-popover';
import {useUserContext} from '../contexts/user-context';
import { useAuthContext } from '../contexts/auth-context';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const {isAuthenticated} = useAuthContext();
  const {firstName, lastName} = useUserContext();
  const router = useRouter();

  const avatarSize = {
    height: 40,
    width: 40,
    ml: 1,
  }

  const stringToColor = (string) => {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  const stringAvatar = (name) => ({
    sx: {
      cursor: 'pointer',
      ...avatarSize,
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  })

  const redirectToLogin = () => {
    router
      .replace({
        pathname: '/login',
        query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
      })
      .catch(console.error);
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <TextField 
            label="Find your Next Home"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
            margin="normal"
            sx={{width: '40rem'}}
          >
          </TextField>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          {
            isAuthenticated ? 
              <Avatar
                onClick={() => setOpenAccountPopover(true)}
                ref={settingsRef}
                {...stringAvatar(`${firstName} ${lastName}`)}
              /> :
              <Button onClick={redirectToLogin} variant="contained" sx={avatarSize}>
                Login
              </Button>
          }
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
