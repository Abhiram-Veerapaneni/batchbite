import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {

        const fetchRestaurants = async () => {
            const res = await axios.get(
                `${API_URL}restaurants`
            );
            setRestaurants(res.data);
        }

        fetchRestaurants();

    }, []);

    return (
        <div className="restaurant-page">
            <h1>Restaurants</h1>

            {restaurants.map((r) => (
                <div key={r._id} className="restaurant-card">

                    <Link to={`/restaurants/${r._id}`}>
                        <h3>{r.name}</h3>
                    </Link>

                    <p>Zone: {r.zone}</p>

                </div>
            ))}

        </div>
    );
}

export default Restaurants