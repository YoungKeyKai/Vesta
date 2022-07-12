import Box from '@mui/material/Box';

import urls from './constants';
import LinkButton from './linkButton';

export default function Homepage() {
    const linkButtonSX = {
        backgroundColor: "#84CEEB",
        width: 1 / 4,
        fontSize: 30,
    };

    return (
        <Box
            className='Homepage'
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                className='ButtonBox'
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    width: 1,
                    height: 1 / 3
                }}
            >
                <LinkButton
                    to={urls.market}
                    sx={linkButtonSX}
                >
                    Find Listings
                </LinkButton>
                <LinkButton
                    to={urls.loginPage}
                    sx={linkButtonSX}
                >
                    Create Listings
                </LinkButton>
                <LinkButton
                    to={urls.loginPage}
                    sx={linkButtonSX}
                >
                    Your Listings
                </LinkButton>
            </Box>
        </Box>
    );
}
