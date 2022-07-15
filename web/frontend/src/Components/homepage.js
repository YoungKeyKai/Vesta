import { Typography, Box } from '@mui/material';

import urls from './constants';
import LinkButton from './linkButton';

export default function Homepage() {
    const linkButtonSize = {
        width: 1 / 4,
        fontSize: 30,
    };

    return (
        <Box
            className='Homepage'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: 1,
                height: 1,
            }}
        >
            <Typography sx={{color: '#8860D0', fontSize: 96}}>
                Vesta
            </Typography>
            <Box
                className='ButtonBox'
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    width: 1,
                    height: 1 / 3,
                }}
            >
                <LinkButton
                    to={urls.market}
                    sx={{
                        backgroundColor: "#84CEEB",
                        ...linkButtonSize,
                    }}
                >
                    Find Listings
                </LinkButton>
                <LinkButton
                    to={urls.loginPage}
                    sx={{
                        backgroundColor: "#5AB9EA",
                        ...linkButtonSize,
                    }}
                >
                    Create Listings
                </LinkButton>
                <LinkButton
                    to={urls.loginPage}
                    sx={{
                        backgroundColor: "#8860D0",
                        ...linkButtonSize,
                    }}
                >
                    Your Listings
                </LinkButton>
            </Box>
        </Box>
    );
}
