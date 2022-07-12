import urls from './constants'
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <p>
                Vesta!!
            </p>
            <Link to={urls.market}>Go to the next page here</Link>
        </div>
    );
}

export default Home;