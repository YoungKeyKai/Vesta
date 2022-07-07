import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";

import Random from './Components/random';
import Home from './Components/home';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/random" element={<Random />} />
        </Routes>
    </Router>
  );
}

export default App;
