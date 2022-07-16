import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";
import { Box } from "@mui/material";

import { pages } from './Components/constants';
import Market from './Components/market';
import Homepage from './Components/homepage';
import LoginPage from "./Components/loginPage";
import TopBar from "./Components/topBar";

export default function App() {
    return (
        <Router>
            <Box
                className="BackgroundContainer"
                sx={{ backgroundColor: "#E1E7FF", height: '100vh', width: '100vw' }}
            >
                <TopBar sx={{ width: '100vw', height: '10vh' }} />
                <Box sx={{ width: 1, height: 0.9 }}>
                    <Routes>
                        <Route path={pages.homepage.url} element={<Homepage />} />
                        <Route path={pages.market.url} element={<Market />} />
                        <Route path={pages.loginPage.url} element={<LoginPage />} />
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}
