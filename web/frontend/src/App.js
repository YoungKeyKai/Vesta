import {
    Routes,
    Route,
    BrowserRouter as Router
} from "react-router-dom";

import Market from './Components/market';
import Home from './Components/home';

function App() {
    return (
        <div
            className="BackgroundContainer"
            style={{
                textAlign: "center",
                backgroundColor: "#E1E7FF",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "calc(10px + 2vmin)",
                color: "black",
            }}
        >
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/market" element={<Market />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
