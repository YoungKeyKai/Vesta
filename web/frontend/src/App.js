import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";
import "@fontsource/josefin-sans";

import { pages } from './constants';
import Market from './components/market';
import Homepage from './components/homepage';
import LoginPage from "./components/loginPage";
import CreateListing from './components/createListing'
import TopBar from "./components/topBar";
import ListingsPage from './components/listingsPage';

import './css/app.css';

export default function App() {
    return (
        <Router>
            <div className="app-container">
                <TopBar sx={{ height: '10vh' }} />
                <div className="page-panel">
                    <Routes>
                        <Route path={pages.homepage.url} element={<Homepage />} />
                        <Route path={pages.market.url} element={<Market />} />
                        <Route path={pages.loginPage.url} element={<LoginPage />} />
                        <Route path={pages.createListingPage.url} element={<CreateListing />} />
                        <Route path={pages.listings.url} element={<ListingsPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
