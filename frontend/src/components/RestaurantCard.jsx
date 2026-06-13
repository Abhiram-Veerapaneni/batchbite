import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {

  const navigate = useNavigate();

  return (
    <div
      className="restaurant-card"
      onClick={() =>
        navigate(`/restaurants/${restaurant._id}`)
      }
    >

      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="restaurant-card-image"
      />

      <div className="restaurant-card-body">

        <h3 className="restaurant-card-name">
          {restaurant.name}
        </h3>

        <p className="restaurant-card-region">
          {restaurant.region}
        </p>

      </div>

    </div>
  );
}

export default RestaurantCard;