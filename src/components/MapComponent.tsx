import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrige o problema do ícone padrão do marcador no Leaflet com bundlers como o Vite
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  restaurants: Restaurant[];
}

const MapComponent = ({ restaurants }: MapComponentProps) => {
  const position: [number, number] = [-14.235, -51.9253]; // Centro do Brasil

  return (
    <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map(restaurant => (
        <Marker key={restaurant.id} position={[restaurant.latitude, restaurant.longitude]}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold font-heading">{restaurant.name}</h3>
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