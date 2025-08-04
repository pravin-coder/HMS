import React from 'react';
import { Link } from 'react-router-dom';

const PopularLocations = () => {
  const locations = [
    {
      name: 'Paris',
      image: 'https://media.timeout.com/images/106181719/750/562/image.jpg',
    },
    {
      name: 'New York',
      image:
        'https://images.musement.com/cover/0002/42/view-on-manhattan-at-night-new-york-city_header-141511.jpeg?w=1200&h=630&q=95&fit=crop',
    },
    {
      name: 'Tokyo',
      image:
        'https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9reW98ZW58MHx8MHx8fDA%3D',
    },
    {
      name: 'Sydney',
      image:
        'https://cdn.britannica.com/71/188471-050-CF188A6B/Sydney-Opera-House-Port-Jackson.jpg',
    },
    {
      name: 'Jaipur',
      image:
        'https://www.agoda.com/wp-content/uploads/2024/05/Nahargarh-Fort-jaipur-india-1244x700.jpg',
    },
  ];

  return (
    <div className="text-center py-8 font-sans popular-location">
      <div className="flex justify-center flex-wrap gap-6 px-4">
        {locations.map((location) => (
          <Link
            to={`/hotelsbylocation?location=${location.name}`}
            key={location.name}
            className="location-link"
          >
            <div className="relative w-[250px] h-[180px] overflow-hidden rounded-[10px] shadow-md hover:shadow-lg transform transition-transform duration-400 ease-in-out hover:scale-110 group location-card">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover transition-transform duration-600 ease-in-out group-hover:scale-110 group-hover:opacity-40 location-image"
              />
              <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 scale-[0.9] text-white font-semibold uppercase tracking-wide bg-black bg-opacity-50 px-4 py-2 rounded-full text-[1.2rem] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-in-out location-name">
                {location.name}
                <span className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-45deg] opacity-40 group-hover:left-[100%] transition-all duration-600 ease-in-out" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularLocations;
