import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { Pizza, Fish, Drumstick, Vegan, MapPin, Star } from 'lucide-react';

const iconMap = {
  'Italiana': { icon: <Pizza size={14} color="white" />, color: '#E63946' },
  'Japonesa': { icon: <Fish size={14} color="white" />, color: '#457B9D' },
  'Brasileira': { icon: <Drumstick size={14} color="white" />, color: '#2A9D8F' },
  'Vegetariana': { icon: <Vegan size={14} color="white" />, color: '#E9C46A' },
  'default': { icon: <Star size={14} color="white" />, color: '#A8DADC' }
};

const createUserIcon = () => {
  const iconHtml = renderToString(<MapPin size={18} color="white" />);
  return L.divIcon({
    html: `<div style="background-color: #1D3557; padding: 6px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white;">${iconHtml}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const createCuisineIcon = (cuisine: string | null) => {
  const selected = cuisine && iconMap[cuisine as keyof typeof iconMap] ? iconMap[cuisine as keyof typeof iconMap] : iconMap.default;
  const iconHtml = renderToString(selected.icon);

  return L.divIcon({
    html: `<div style="background-color: ${selected.color}; padding: 5px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">${iconHtml}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

export { createCuisineIcon, createUserIcon };