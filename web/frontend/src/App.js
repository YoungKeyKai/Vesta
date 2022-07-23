import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";
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
            <div className="app-container">
                <TopBar sx={{ height: '10vh' }} />
                <div className="page-panel">
                    <Routes>
                        <Route path={pages.homepage.url} element={<Homepage />} />
                        <Route path={pages.market.url} element={<Market />} />
                        <Route path={pages.loginPage.url} element={<LoginPage />} />
                        <Route path={pages.listings.url} element={<ListingsPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
