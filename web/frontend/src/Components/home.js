import './home.css';
import logo from './logo.svg';
import {Link} from "react-router-dom";

function Home() {
    return (
        <div className="HomePage">
            <header className="HomePage-header">
                <p>
                    Vesta!!
                </p>
                <Link to={"random"}>Go to the next page here</Link>
                <img src={logo} className="HomePage-logo" alt="logo" />
                <a
                    className="HomePage-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default Home;