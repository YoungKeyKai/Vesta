import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";
import { Box } from "@mui/material";

import urls from './Components/constants';
import Market from './Components/market';
import Homepage from './Components/homepage';
import LoginPage from "./Components/loginPage";
import TopBar from "./Components/topBar";

function App() {
    return (
        <Box
            className="BackgroundContainer"
            sx={{ backgroundColor: "#E1E7FF", minHeight: '100vh', minWidth: '100vw' }}
        >
            <TopBar />
            <Router>
                <Routes>
                    <Route path={urls.homepage} element={<Homepage />} />
                    <Route path={urls.market} element={<Market />} />
                    <Route path={urls.loginPage} element={<LoginPage />} />
                </Routes>
            </Router>
        </Box>
    );
}

export default App;
