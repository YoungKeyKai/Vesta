import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';

import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Chat as ChatIcon } from '../icons/chat';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { useAuthContext } from '../contexts/auth-context';
import { pages } from '../constants';

const authItems = [
  {
    href: pages.createListingPage.url,
    icon: (<CreateIcon fontSize="small" />),
    title: pages.createListingPage.name
  },
  {
    href: pages.yourListingsPage.url,
    icon: (<InventoryIcon fontSize="small" />),
    title: pages.yourListingsPage.name
  },
  {
    href: pages.yourBookmarksPage.url,
    icon: (<BookmarksIcon fontSize="small" />),
    title: pages.yourBookmarksPage.name
  },
  {
    href: pages.chat.url,
    icon: (<ChatIcon fontSize="small" />),
    title: pages.chat.name
  },
  {
    href: pages.accountPage.url,
    icon: (<UserIcon fontSize="small" />),
    title: pages.accountPage.name
  },
  {
    href: pages.settingsPage.url,
    icon: (<CogIcon fontSize="small" />),
    title: pages.settingsPage.name
  },
];

const unauthItems = [
  {
    href: pages.loginPage.url,
    icon: (<LockIcon fontSize="small" />),
    title: pages.loginPage.name
  },
  {
    href: pages.registrationPage.url,
    icon: (<UserAddIcon fontSize="small" />),
    title: pages.registrationPage.name
  },
];

const defaultItems = [
  {
    href: pages.homepage.url,
    icon: (<HomeIcon fontSize="small" />),
    title: pages.homepage.name
  },
  {
    href: pages.market.url,
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: pages.market.name
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const [ navItems, setNavItems ] = useState(defaultItems.concat(unauthItems));
  const {isAuthenticated} = useAuthContext()
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }

      if (isAuthenticated) {
        setNavItems(defaultItems.concat(authItems))
      } else {
        setNavItems(defaultItems.concat(unauthItems))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath, isAuthenticated]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  Vesta
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {
            navItems.map((item) => (
              <NavItem
                key={item.title}
                icon={item.icon}
                href={item.href}
                title={item.title}
              />
            ))
          }
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
