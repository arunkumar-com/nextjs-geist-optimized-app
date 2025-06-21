import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const { _id, name, description, image } = restaurant;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-t-lg mb-4"
      />
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-primary">{name}</h3>
        <p className="text-gray-600 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            <span className="mr-4">
              2-Seat Tables: {restaurant.tables.twoSeater}
            </span>
            <span>
              4-Seat Tables: {restaurant.tables.fourSeater}
            </span>
          </div>
          <Link 
            to={`/restaurant/${_id}`}
            className="btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
