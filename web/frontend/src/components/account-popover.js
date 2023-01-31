import Router from 'next/router';
import PropTypes from 'prop-types';
import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuthContext } from '../contexts/auth-context';
import { useUserContext } from '../contexts/user-context';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const {logout} = useAuthContext();
  const {firstName, lastName} = useUserContext();

  const handleLogout = async () => {
    onClose?.();
    logout();

    // Redirect to login page
    Router
      .push('/login')
      .catch(console.error);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: '300px' }
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {`${firstName} ${lastName}`}
        </Typography>
      </Box>
      <MenuList
        disablePadding
        sx={{
          '& > *': {
            '&:first-of-type': {
              borderTopColor: 'divider',
              borderTopStyle: 'solid',
              borderTopWidth: '1px'
            },
            padding: '12px 16px'
          }
        }}
      >
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
