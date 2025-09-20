import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { createCuisineIcon, createUserIcon } from './CuisineIcon';
import { useEffect } from 'react';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cuisine: string | null;
}

interface MapComponentProps {
  restaurants: Restaurant[];
  userPosition: [number, number] | null;
}

const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ restaurants, userPosition }: MapComponentProps) => {
  const initialPosition: [number, number] = userPosition || [-14.235, -51.9253];
  const initialZoom = userPosition ? 13 : 4;

  return (
    <MapContainer center={initialPosition} zoom={initialZoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={initialPosition} zoom={initialZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userPosition && (
        <Marker position={userPosition} icon={createUserIcon()}>
          <Popup>Você está aqui!</Popup>
        </Marker>
      )}
      {restaurants.map(restaurant => (
        <Marker 
          key={restaurant.id} 
          position={[restaurant.latitude, restaurant.longitude]}
          icon={createCuisineIcon(restaurant.cuisine)}
        >
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold font-heading">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">{restaurant.cuisine || 'Culinária não definida'}</p>
              <Link to={`/restaurant/${restaurant.id}`} className="text-primary hover:underline text-sm">
                Ver detalhes
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;