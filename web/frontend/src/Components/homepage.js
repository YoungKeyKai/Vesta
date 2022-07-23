import '../css/homepage.css';
import { pages } from '../constants';
import LinkButton from './linkButton';

export default function Homepage() {
    const linkButtonSize = {
        width: 1 / 4,
        fontSize: 30,
    };

    return (
        <div className='homepage'>
            <h1 className='vesta-main-title'>
                Vesta
            </h1>
            <div className='button-box'>
                <LinkButton
                    to={pages.market.url}
                    sx={{
                        backgroundColor: "#84CEEB",
                        ...linkButtonSize,
                    }}
                >
                    Find Listings
                </LinkButton>
                <LinkButton
                    to={pages.loginPage.url}
                    sx={{
                        backgroundColor: "#5AB9EA",
                        ...linkButtonSize,
                    }}
                >
                    Create Listings
                </LinkButton>
                <LinkButton
                    to={pages.loginPage.url}
                    sx={{
                        backgroundColor: "#8860D0",
                        ...linkButtonSize,
                    }}
                >
                    Your Listings
                </LinkButton>
            </div>
        </div>
    );
}
