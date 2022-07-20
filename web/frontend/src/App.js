import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";
import { Box } from "@mui/material";
import "@fontsource/josefin-sans";

import { pages } from './constants';
import Market from './Components/market';
import Homepage from './Components/homepage';
import LoginPage from "./Components/loginPage";
import TopBar from "./Components/topBar";
import ListingsPage from './Components/listingsPage';

import './css/app.css';

export default function App() {
    return (
        <Router>
            <Box
                className="BackgroundContainer"
                sx={{ backgroundColor: "#E1E7FF", height: '100vh' }}
            >
                <TopBar sx={{ width: '100vw', height: '10vh' }} />
                <Box>
                    <Routes>
                        <Route path={pages.homepage.url} element={<Homepage />} />
                        <Route path={pages.market.url} element={<Market />} />
                        <Route path={pages.loginPage.url} element={<LoginPage />} />
                        <Route path={pages.listings.url} element={<ListingsPage />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}
