import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";

import Market from './Components/market';
import Home from './Components/home';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
        </Routes>
    </Router>
  );
}

export default App;
