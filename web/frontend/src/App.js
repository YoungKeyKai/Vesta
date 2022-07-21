import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";

import { pages } from './Components/constants';
import Market from './Components/market';
import Homepage from './Components/homepage';
import LoginPage from "./Components/loginPage";
import TopBar from "./Components/topBar";

import "@fontsource/josefin-sans";
import './css/app.css';

export default function App() {
    return (
        <Router>
            <div className="app-container">
                <TopBar sx={{ width: '100vw', height: '10vh' }} />
                <div className="page-panel">
                    <Routes>
                        <Route path={pages.homepage.url} element={<Homepage />} />
                        <Route path={pages.market.url} element={<Market />} />
                        <Route path={pages.loginPage.url} element={<LoginPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
